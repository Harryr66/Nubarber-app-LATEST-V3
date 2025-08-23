"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  shopName: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    console.log('AuthProvider: login called with user data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    console.log('AuthProvider: auth state updated');
  };

  const logout = async () => {
    try {
      // Clear the auth token cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear all localStorage data
      localStorage.removeItem('nubarber_logo');
      localStorage.removeItem('nubarber_logo_name');
      localStorage.removeItem('nubarber_business_name');
      localStorage.removeItem('current_user_email');
      
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to sign in page
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      window.location.href = '/sign-in';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isLoading, 
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 