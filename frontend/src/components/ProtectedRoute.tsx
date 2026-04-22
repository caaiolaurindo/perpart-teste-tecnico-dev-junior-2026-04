'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (adminOnly && user.role !== 'admin') {
        router.push('/produtos');
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) return null;
  if (adminOnly && user.role !== 'admin') return null;

  return <>{children}</>;
}