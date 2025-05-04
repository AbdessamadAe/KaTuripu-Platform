"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    } catch (error) {
      console.error('Error refreshing auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of user data
    refreshAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Refresh auth state on pathname changes to ensure auth state is up-to-date
  // after redirects (like from OAuth callback)
  useEffect(() => {
    if (pathname?.includes('/auth/callback')) {
      // Add slight delay to ensure Supabase has time to process session
      const timer = setTimeout(() => {
        refreshAuth();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
