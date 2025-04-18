"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/lib/db/supabase';

interface AuthContextType {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache user data in localStorage
const cacheUser = (userData: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cachedUser', JSON.stringify(userData));
    }
};

// Retrieve cached user data
const getCachedUser = () => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('cachedUser');
        return userData ? JSON.parse(userData) : null;
    }
    return null;
};

// Clear cached user data
const clearCachedUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cachedUser');
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Set user with caching
    const setUserWithCache = (userData: any) => {
        setUser(userData);
        if (userData) {
            cacheUser(userData);
            setIsAuthenticated(true);
        } else {
            clearCachedUser();
            setIsAuthenticated(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    skipBrowserRedirect: false
                }
            });
            
            if (error) {
                console.error("Error logging in with Google:", error);
                throw error;
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            setUserWithCache(null);
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Initialize with cached user if available
        const cachedUser = getCachedUser();
        if (cachedUser) {
            setUser(cachedUser);
            setIsAuthenticated(true);
            setLoading(false);
        }

        // Fetch the session on initial load
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    const { data: userData } = await supabase.auth.getUser();
                    if (!mounted) return;

                    setUserWithCache(userData?.user);

                    await supabase.from("users").upsert({
                        id: userData.user?.id,
                        email: userData.user?.email,
                        name: userData.user?.user_metadata?.full_name,
                    });

                } else {
                    setUserWithCache(null);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
                if (!mounted) return;

                setUserWithCache(null);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchSession();

        // Set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setLoading(true);
          
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUserWithCache(session?.user ?? null);
          
                await supabase.from("users").upsert({
                  id: session?.user?.id,
                  email: session?.user?.email,
                  name: session?.user?.user_metadata?.full_name,
                });
          
              } else if (event === 'SIGNED_OUT') {
                setUserWithCache(null);
              }
          
              setLoading(false);
            }
          );
          

        // Cleanup subscription on unmount
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, loginWithGoogle, logout }}>
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