import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const [searchParams] = useSearchParams();

  if (token) {
    const next = searchParams.get('next') || '/';
    return <Navigate to={next} replace />;
  }

  return <>{children}</>;
};
