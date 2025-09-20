
'use client';

import React, { createContext, useContext, useState } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

// Create a mock user
const mockUser = {
  uid: 'mock-user-123',
  displayName: 'Local Developer',
  email: 'dev@example.com',
  photoURL: `https://i.pravatar.cc/150?u=mock-user-123`,
  // Add other user properties your app might need
  providerId: 'password',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
} as unknown as User;


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set to false as we are not fetching anything async

  const signInWithGoogle = async () => {
    // Simulate a successful sign-in by setting the mock user
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    setUser(mockUser);
    setLoading(false);
  };

  const signOutUser = async () => {
    // Simulate a sign-out
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, signInWithGoogle, signOutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
