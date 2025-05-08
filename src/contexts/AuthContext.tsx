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

  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
  });

  // Enhanced auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Force refresh on SIGNED_IN event (like after OAuth callback)
      if (event === 'SIGNED_IN') {
        // Wait a brief moment to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 300));
        // Force a full page reload to sync server and client states
        window.location.href = pathname || '/';
      }
      queryClient.setQueryData(['auth'], session);
    });
    
    return () => subscription?.unsubscribe();
  }, [queryClient, pathname]);

  // Remove the separate callback effect as it's now handled above

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