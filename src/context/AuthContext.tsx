import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * AUTHENTICATION CONTEXT & STATE ENGINE (MOCK / LOCAL)
 * =========================================================================
 * NOTE / BACKEND INTEGRATION PLACEHOLDER:
 * This is currently a client-side mock authentication engine utilizing
 * browser LocalStorage. In production, this logic will be replaced with
 * real backend authentication (e.g. Firebase Auth, Supabase, or custom
 * JWT OAuth endpoints with encrypted credentials & token refresh cycles).
 * =========================================================================
 */

export type UserRole = 'farmer' | 'customer';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: string; // Farm location or delivery city
  farmName?: string; // Optional for farmers
  address?: string;  // Customer delivery address
  joinedDate?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  user: UserProfile | null;
  login: (role: UserRole, email: string, name?: string) => void;
  signup: (role: UserRole, profile: Omit<UserProfile, 'role'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auricvista_auth_state';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if parsing fails
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable or restricted
    }
  }, [user]);

  const login = (role: UserRole, email: string, name?: string) => {
    // Generate simulated user info based on role if name not provided
    const defaultName = role === 'farmer' ? (name || 'Ravi Kumar') : (name || 'Ananya Sharma');
    const defaultLocation = role === 'farmer' ? 'Chikkaballapur Valley, Karnataka' : 'Indiranagar, Bengaluru';

    const newUser: UserProfile = {
      name: defaultName,
      email: email.trim().toLowerCase(),
      role,
      location: defaultLocation,
      farmName: role === 'farmer' ? 'Kumar Organic Heritage Farm #702' : undefined,
      address: role === 'customer' ? 'Flat 402, Green Meadows, 12th Main, Indiranagar' : undefined,
      phone: '+91 98450 12890',
      joinedDate: 'August 2026',
    };

    setUser(newUser);
  };

  const signup = (role: UserRole, profile: Omit<UserProfile, 'role'>) => {
    const newUser: UserProfile = {
      ...profile,
      role,
      joinedDate: 'August 2026',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const isLoggedIn = !!user;
  const userRole = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
