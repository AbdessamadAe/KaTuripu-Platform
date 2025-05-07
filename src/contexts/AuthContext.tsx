"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const fetchSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // React Query manages session state, loading, and errors
  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // Revalidate every 5 minutes
  });

  // Listen for auth changes (e.g., login/logout)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      queryClient.setQueryData(['auth'], session); // Update cache instantly
    });
    return () => subscription?.unsubscribe();
  }, [queryClient]);

  // Refresh auth after OAuth callback
  useEffect(() => {
    if (pathname?.includes('/auth/callback')) {
      setTimeout(() => refetch(), 500);
    }
  }, [pathname, refetch]);

  // Exposed auth state
  const value = {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading,
    refreshAuth: refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
