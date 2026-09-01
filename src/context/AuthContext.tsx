import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'farmer' | 'customer';

export interface FarmerProfileMetadata {
  id: string;
  farmerSlug: string;
  farmName: string;
  location: string;
  experience?: string;
  specialty?: string;
  acreage?: string;
  highlightBadge?: string;
  verificationStatus?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: string;
  farmName?: string;
  address?: string;
  createdAt?: string;
  farmerProfile?: FarmerProfileMetadata;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  location?: string;
  farmName?: string;
  address?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<UserProfile>;
  signup: (data: SignupData) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'auricvista_auth_token';
const USER_STORAGE_KEY = 'auricvista_auth_state';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token and user to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }

      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Storage restricted
    }
  }, [token, user]);

  // Verify JWT session on app load
  const verifySession = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token expired or invalid
        console.warn('Session expired or invalid token; clearing authentication state.');
        setToken(null);
        setUser(null);
      }
    } catch (err: any) {
      console.warn('Could not verify session with backend, keeping cached profile:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifySession(token);
    } else {
      setIsLoading(false);
    }
  }, [token, verifySession]);

  const login = async (email: string, password: string, role?: UserRole): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      // Check role match if requested
      if (role && data.user.role !== role) {
        throw new Error(
          `This account is registered as a ${data.user.role}. Please select the ${data.user.role.toUpperCase()} portal.`
        );
      }

      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        const errorDetail = Array.isArray(resData.details)
          ? resData.details.join('. ')
          : resData.error;
        throw new Error(errorDetail || 'Failed to register account.');
      }

      setToken(resData.token);
      setUser(resData.user);
      return resData.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const isLoggedIn = !!user && !!token;
  const userRole = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        getAuthHeaders,
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
