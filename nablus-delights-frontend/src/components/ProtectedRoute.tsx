// File: src/components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is still loading, or if there's no token, redirect to login
    if (!token) {
      router.push('/login');
      return;
    }
    
    // If the user's role is not in the list of allowed roles, redirect to home
    if (user && !allowedRoles.includes(user.role)) {
      router.push('/');
    }
  }, [user, token, router, allowedRoles]);

  // If the user has the correct role, render the children components
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, show a loading state or nothing while redirecting
  return <p className="text-center p-12">Loading or redirecting...</p>;
}