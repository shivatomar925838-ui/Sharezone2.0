import { useRef, useEffect } from 'react';

export default function Logo3D({ size = 36, className = '' }) {
  const logoRef = useRef(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;

    let animFrame;
    let angle = 0;

    function animate() {
      angle += 0.5;
      const rotateY = Math.sin(angle * Math.PI / 180) * 15;
      const rotateX = Math.cos(angle * Math.PI / 180) * 8;
      const scale = 1 + Math.sin(angle * 2 * Math.PI / 180) * 0.03;

      el.style.transform = `perspective(400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
      animFrame = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div
      ref={logoRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.4))' }}
      >
        <defs>
          <linearGradient id="thaliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="shine" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="url(#thaliGrad)" stroke="#059669" strokeWidth="2" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="50" cy="50" r="36" fill="#047857" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        <ellipse cx="40" cy="45" rx="12" ry="8" fill="url(#foodGrad)" opacity="0.9" />
        <circle cx="60" cy="42" r="8" fill="#dc2626" opacity="0.85" />
        <ellipse cx="60" cy="41" rx="6" ry="2" fill="#fca5a5" opacity="0.4" />
        <circle cx="50" cy="60" r="9" fill="#d97706" opacity="0.85" />
        <circle cx="50" cy="60" r="7" fill="#f59e0b" opacity="0.5" />
        <circle cx="35" cy="58" r="5" fill="#16a34a" opacity="0.8" />

        <circle cx="50" cy="50" r="46" fill="url(#shine)" />

        <g transform="translate(50,50)" opacity="0.95">
          <path d="M-18,-2 A18,18 0 0,1 14,-11" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polygon points="14,-14 17,-8 11,-9" fill="white" />
          <path d="M18,2 A18,18 0 0,1 -14,11" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polygon points="-14,14 -17,8 -11,9" fill="white" />
        </g>
      </svg>
    </div>
  );
}
