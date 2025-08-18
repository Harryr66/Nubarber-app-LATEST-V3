"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  shopName: string | null;
  login: (email: string, shopName?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on component mount
    const auth = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    const shop = localStorage.getItem("shopName");
    
    if (auth === "true" && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setShopName(shop);
    }
  }, []);

  const login = (email: string, shop?: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setShopName(shop || null);
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    if (shop) {
      localStorage.setItem("shopName", shop);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setShopName(null);
    
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("shopName");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, shopName, login, logout }}>
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