import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Construct the user object from user_metadata
        setUser({ id: session.user.id, email: session.user.email, ...session.user.user_metadata });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email, ...session.user.user_metadata });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      user: { id: data.user.id, email: data.user.email, ...data.user.user_metadata } 
    };
  }, []);

  const signup = useCallback(async (name, email, password, role, verificationData = {}) => {
    // Determine avatar and default stats based on role
    const avatar = role === 'donor' ? '🍳' : role === 'ngo' ? '🏢' : '🚴';
    const stats = role === 'donor' 
      ? { donated: 0, mealsServed: 0, kgSaved: 0 }
      : role === 'ngo'
      ? { received: 0, peopleFed: 0, partnered: 0 }
      : { delivered: 0, kmTraveled: 0, hoursVolunteered: 0 };
    const location = { 
      lat: 28.6139, 
      lng: 77.2090, 
      address: verificationData.address || verificationData.ngoAddress || 'New Delhi, India' 
    };
    const verification = {
      status: verificationData.verificationStatus || 'unverified',
      ...(role === 'ngo' ? {
        darpanId: verificationData.darpanId || '',
        registrationNo: verificationData.registrationNo || '',
        foundingYear: verificationData.foundingYear || '',
        website: verificationData.website || '',
      } : {
        phoneVerified: verificationData.phoneVerified || false,
        idType: verificationData.idType || '',
        idVerified: verificationData.idVerified || false,
      }),
    };

    const userMetadata = {
      name,
      role,
      phone: verificationData.phone || '',
      avatar,
      stats,
      location,
      verification,
      createdAt: new Date().toISOString()
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      user: { id: data.user.id, email: data.user.email, ...data.user.user_metadata } 
    };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
