import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { mockDonations, mockNotifications, mockInfluencerRequests } from '../data/mockData';
import { useVoice } from '../components/VoiceAssistant';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [donations, setDonations] = useState(mockDonations);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [influencerRequests, setInfluencerRequests] = useState(mockInfluencerRequests);
  const [toasts, setToasts] = useState([]);
  const { speak } = useVoice();
  const speakRef = useRef(speak);
  speakRef.current = speak;

  // Add a new donation (supports all categories)
  const addDonation = useCallback((donation) => {
    const isFood = donation.category === 'food';
    const displayName = donation.itemName || donation.foodName;

    const newDonation = {
      ...donation,
      id: 'don_' + Date.now(),
      foodName: displayName,
      itemName: displayName,
      status: 'posted',
      matchedNgoId: null,
      volunteerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDonations(prev => [newDonation, ...prev]);
    addNotification({
      title: isFood ? '✅ Food Donation Posted!' : `✅ ${donation.category === 'clothes' ? '👕' : donation.category === 'ration' ? '🛒' : '📦'} Donation Posted!`,
      body: `Your ${displayName} donation is now live. Nearby NGOs are being notified.`,
      type: 'new_donation',
      relatedDonationId: newDonation.id,
    });
    showToast(`Donation posted successfully! Matching nearby NGOs...`, 'success');

    // Voice: Donation posted
    speakRef.current(`Your donation of ${displayName}, ${donation.quantity || ''} has been posted. Searching for nearby NGOs now.`);
    
    // Simulate auto-matching after 3 seconds
    setTimeout(() => {
      setDonations(prev =>
        prev.map(d =>
          d.id === newDonation.id
            ? { ...d, status: 'matched', matchedNgoId: 'ngo1', matchedNgoName: 'Feeding India Foundation', updatedAt: new Date().toISOString() }
            : d
        )
      );
      addNotification({
        title: '🎯 Auto-Matched!',
        body: `${displayName} matched with Feeding India Foundation (2.3 km away).`,
        type: 'matched',
        relatedDonationId: newDonation.id,
      });
      showToast('🎯 Matched with Feeding India Foundation!', 'info');

      // Voice: NGO matched
      speakRef.current(`Great news! Your ${displayName} has been matched with Feeding India Foundation, 2.3 kilometers away. Looking for a volunteer now.`);
    }, 3000);

    // Simulate volunteer auto-pickup 5 seconds after matching (8 seconds total)
    setTimeout(() => {
      setDonations(prev =>
        prev.map(d =>
          d.id === newDonation.id && d.status === 'matched'
            ? { ...d, status: 'picked_up', volunteerId: 'volunteer1', volunteerName: 'Rahul Verma', updatedAt: new Date().toISOString() }
            : d
        )
      );
      addNotification({
        title: '🚴 Volunteer Assigned!',
        body: `Rahul Verma is picking up ${displayName} and heading to the NGO.`,
        type: 'picked_up',
        relatedDonationId: newDonation.id,
      });
      showToast('🚴 Volunteer Rahul Verma accepted the pickup!', 'success');

      // Voice: Volunteer pickup with ETA
      const etaMinutes = Math.floor(Math.random() * 10) + 8;
      speakRef.current(`Volunteer Rahul Verma has accepted the pickup and is on the way. Estimated arrival in ${etaMinutes} minutes. Your donation will reach those in need soon!`);
    }, 8000);

    return newDonation;
  }, []);

  // Claim a donation (NGO action)
  const claimDonation = useCallback((donationId, ngoId, ngoName) => {
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? { ...d, status: 'matched', matchedNgoId: ngoId, matchedNgoName: ngoName, updatedAt: new Date().toISOString() }
          : d
      )
    );
    showToast('Donation claimed! Waiting for volunteer pickup.', 'success');
    addNotification({
      title: '🤝 Donation Claimed',
      body: `${ngoName} claimed the donation. Looking for a volunteer...`,
      type: 'matched',
      relatedDonationId: donationId,
    });
  }, []);

  // Accept delivery (Volunteer action)
  const acceptDelivery = useCallback((donationId, volunteerId, volunteerName) => {
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? { ...d, status: 'picked_up', volunteerId, volunteerName, updatedAt: new Date().toISOString() }
          : d
      )
    );
    showToast('🚴 Delivery accepted! You can see your route on the map.', 'success');
    addNotification({
      title: '🚴 Pickup Accepted',
      body: `${volunteerName} is heading to pick up the donation.`,
      type: 'picked_up',
      relatedDonationId: donationId,
    });

    // Voice: Volunteer accepted pickup
    const etaMin = Math.floor(Math.random() * 10) + 8;
    speakRef.current(`You have accepted the delivery. The pickup point is about ${etaMin} minutes away. Check your route on the map. Good luck!`);

    // Auto-deliver after 60 seconds (so the volunteer can be seen moving on the map)
    setTimeout(() => {
      setDonations(prev =>
        prev.map(d =>
          d.id === donationId && d.status === 'picked_up'
            ? { ...d, status: 'delivered', updatedAt: new Date().toISOString() }
            : d
        )
      );
      addNotification({
        title: '🎉 Delivered!',
        body: 'Donation has been successfully delivered. Thank you for making a difference!',
        type: 'delivered',
        relatedDonationId: donationId,
      });
      showToast('🎉 Delivery completed! Donation reached those in need.', 'success');
      speakRef.current('Delivery completed successfully! The donation has reached those in need. Thank you for making a difference!');
    }, 60000); // 60 seconds — enough time to see the volunteer moving
  }, []);

  // Mark a delivery as completed (Volunteer manual action)
  const markDelivered = useCallback((donationId) => {
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? { ...d, status: 'delivered', updatedAt: new Date().toISOString() }
          : d
      )
    );
    showToast('🎉 Delivery completed! Donation reached those in need.', 'success');
    speakRef.current('Delivery marked as complete. The donation has been delivered. Thank you for your service!');
    addNotification({
      title: '🎉 Delivered!',
      body: 'Donation has been successfully delivered. Thank you for making a difference!',
      type: 'delivered',
      relatedDonationId: donationId,
    });
  }, []);

  // Submit an influencer collaboration request
  const submitInfluencerRequest = useCallback((request) => {
    const newRequest = {
      ...request,
      id: 'inf_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setInfluencerRequests(prev => [newRequest, ...prev]);
    showToast('🌟 Collaboration request submitted! We\'ll connect you with the NGO soon.', 'success');
    speakRef.current(`Your collaboration request has been submitted to ${request.ngoName}. Our team will review it and connect you shortly. Thank you for using your influence for good!`);
    addNotification({
      title: '🌟 Influencer Collab Request',
      body: `${request.name} wants to collaborate with ${request.ngoName}.`,
      type: 'influencer_request',
    });
    return newRequest;
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotif = {
      ...notification,
      id: 'notif_' + Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // Mark notification as read
  const markNotifRead = useCallback((notifId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Toast notifications
  const showToast = useCallback((message, type = 'info') => {
    const id = 'toast_' + Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      donations,
      notifications,
      influencerRequests,
      unreadCount,
      toasts,
      addDonation,
      claimDonation,
      acceptDelivery,
      markDelivered,
      submitInfluencerRequest,
      addNotification,
      markNotifRead,
      markAllRead,
      showToast,
      dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
