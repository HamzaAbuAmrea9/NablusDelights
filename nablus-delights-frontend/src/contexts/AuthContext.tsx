// File: src/contexts/AuthContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  unique_name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // Redirect to home page after logout to ensure a clean state
    router.push('/'); 
  }, [router]);
  
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        const decoded: { exp: number, unique_name: string, role: string } = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setUser({ unique_name: decoded.unique_name, role: decoded.role });
        }
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  }, [logout]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    const decoded: User = jwtDecode(newToken);
    setUser(decoded);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
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