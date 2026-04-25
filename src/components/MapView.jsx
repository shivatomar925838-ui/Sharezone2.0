import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons using emoji
const createEmojiIcon = (emoji, size = 32) => {
  return L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));transition:transform 0.3s ease">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: '',
  });
};

// Generate intermediate points along a route for smooth animation
function interpolateRoute(points, numSteps = 100) {
  if (points.length < 2) return points;
  const interpolated = [];
  const totalSegments = points.length - 1;
  const stepsPerSegment = Math.floor(numSteps / totalSegments);

  for (let i = 0; i < totalSegments; i++) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    for (let j = 0; j < stepsPerSegment; j++) {
      const t = j / stepsPerSegment;
      // Add slight curve/wobble for realistic road movement
      const wobble = Math.sin(t * Math.PI * 4) * 0.0003;
      interpolated.push([
        lat1 + (lat2 - lat1) * t + wobble,
        lng1 + (lng2 - lng1) * t + wobble * 0.7,
      ]);
    }
  }
  interpolated.push(points[points.length - 1]);
  return interpolated;
}

export default function MapView({
  center = [28.6139, 77.2090],
  zoom = 13,
  markers = [],
  height = '300px',
  className = '',
  showRoute = false,
  routePoints = [],
  // NEW: Animated moving marker
  animatedMarker = null, // { emoji, route: [[lat,lng], ...], speed: 800, popup: {...} }
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const animMarkerRef = useRef(null);
  const animIntervalRef = useRef(null);
  const animTrailRef = useRef(null);
  const routeLineRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update static markers
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const icon = createEmojiIcon(m.emoji || '📍', m.size || 28);
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(markersLayerRef.current);

      if (m.popup) {
        marker.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:150px">
            <div style="font-weight:600;font-size:13px;margin-bottom:4px;color:#f1f5f9">${m.popup.title}</div>
            ${m.popup.subtitle ? `<div style="font-size:11px;color:#94a3b8;margin-bottom:4px">${m.popup.subtitle}</div>` : ''}
            ${m.popup.badge ? `<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;background:${m.popup.badgeColor || 'rgba(34, 197, 94, 0.2)'};color:${m.popup.badgeTextColor || '#22C55E'}">${m.popup.badge}</span>` : ''}
          </div>
        `, { className: 'dark-popup' });
      }
    });

    // Fit bounds if there are markers (and no animated marker to center on)
    if (markers.length > 1 && mapInstanceRef.current && !animatedMarker) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers]);

  // Draw route line
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear old route
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (!showRoute || routePoints.length < 2) return;

    const polyline = L.polyline(routePoints, {
      color: '#22c55e',
      weight: 4,
      opacity: 0.6,
      dashArray: '12, 8',
      dashOffset: '0',
    }).addTo(mapInstanceRef.current);

    // Animate dashes
    let offset = 0;
    const dashInterval = setInterval(() => {
      offset -= 1;
      polyline.setStyle({ dashOffset: String(offset) });
    }, 50);

    routeLineRef.current = polyline;

    return () => {
      clearInterval(dashInterval);
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
    };
  }, [showRoute, routePoints]);

  // ===== ANIMATED MOVING MARKER =====
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clean up previous animation
    if (animIntervalRef.current) {
      clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
    }
    if (animMarkerRef.current) {
      animMarkerRef.current.remove();
      animMarkerRef.current = null;
    }
    if (animTrailRef.current) {
      animTrailRef.current.remove();
      animTrailRef.current = null;
    }

    if (!animatedMarker || !animatedMarker.route || animatedMarker.route.length < 2) return;

    const map = mapInstanceRef.current;
    const route = interpolateRoute(animatedMarker.route, 150);
    const speed = animatedMarker.speed || 600; // ms between steps
    let currentStep = 0;

    // Create the moving marker
    const icon = createEmojiIcon(animatedMarker.emoji || '🚴', animatedMarker.size || 34);
    const movingMarker = L.marker(route[0], {
      icon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Add popup to moving marker
    if (animatedMarker.popup) {
      movingMarker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:160px">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px;color:#f1f5f9">${animatedMarker.popup.title}</div>
          ${animatedMarker.popup.subtitle ? `<div style="font-size:11px;color:#94a3b8;margin-bottom:4px">${animatedMarker.popup.subtitle}</div>` : ''}
          <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;background:rgba(34, 197, 94, 0.2);color:#22c55e">🚴 Moving...</span>
        </div>
      `, { className: 'dark-popup' });
    }

    // Create trail (polyline that follows the marker)
    const trailCoords = [route[0]];
    const trail = L.polyline(trailCoords, {
      color: '#22c55e',
      weight: 3,
      opacity: 0.7,
      dashArray: null,
    }).addTo(map);

    // Add a pulsing circle at current position
    const pulseCircle = L.circleMarker(route[0], {
      radius: 12,
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.2,
      weight: 2,
      className: 'pulse-marker',
    }).addTo(map);

    animMarkerRef.current = movingMarker;
    animTrailRef.current = trail;

    // Fit map to show entire route
    const allPoints = [...route, ...markers.map(m => [m.lat, m.lng])];
    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50] });
    }

    // Animate!
    animIntervalRef.current = setInterval(() => {
      currentStep++;

      if (currentStep >= route.length) {
        // Loop back to start for continuous demo
        currentStep = 0;
        trailCoords.length = 0;
        trailCoords.push(route[0]);
        trail.setLatLngs(trailCoords);
      }

      const newPos = route[currentStep];
      movingMarker.setLatLng(newPos);
      pulseCircle.setLatLng(newPos);

      // Extend trail
      trailCoords.push(newPos);
      if (trailCoords.length > 40) trailCoords.shift(); // Keep trail short
      trail.setLatLngs(trailCoords);
    }, speed);

    return () => {
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
      if (animMarkerRef.current) {
        animMarkerRef.current.remove();
        animMarkerRef.current = null;
      }
      if (animTrailRef.current) {
        animTrailRef.current.remove();
        animTrailRef.current = null;
      }
      pulseCircle.remove();
    };
  }, [animatedMarker]);

  return (
    <div
      ref={mapRef}
      className={`rounded-2xl overflow-hidden border border-white/10 ${className}`}
      style={{ height, width: '100%' }}
    />
  );
}
