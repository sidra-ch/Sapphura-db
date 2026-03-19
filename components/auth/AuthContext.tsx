"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

const ADMIN_EMAILS = ['ms.sidrachaudhary@gmail.com'];

function resolveClientRole(email: string, role: unknown): string {
  if (ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
    return 'admin';
  }

  return typeof role === 'string' && role.trim() ? role : 'customer';
}

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [appUser, setAppUser] = useState<User | null>(null);

  const login = (_token: string, _user: User) => {};
  const logout = () => {};

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.emailAddresses[0]?.emailAddress || '';

      setAppUser({
        id: user.id,
        email,
        name: user.fullName || user.firstName || undefined,
        phone: user.phoneNumbers[0]?.phoneNumber || undefined,
        role: resolveClientRole(email, user.publicMetadata?.role),
      });
    } else if (isLoaded && !user) {
      setAppUser(null);
    }
  }, [isLoaded, user]);

  return (
    <AuthContext.Provider value={{ 
      user: appUser, 
      token: appUser?.id || null,
      login,
      logout,
      isLoading: !isLoaded, 
      isSignedIn: isSignedIn || false 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      login: () => {},
      logout: () => {},
      isLoading: true,
    };
  }
  return {
    user: context.user,
    token: context.token,
    login: context.login,
    logout: context.logout,
    isLoading: context.isLoading,
  };
}
