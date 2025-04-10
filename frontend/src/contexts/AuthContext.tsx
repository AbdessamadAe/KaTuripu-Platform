"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

interface AuthContextType {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let mounted = true;

        // Fetch the session on initial load
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    const { data: userData } = await supabase.auth.getUser();
                    if (!mounted) return;

                    setUser(userData);
                    setIsAuthenticated(true);

                    await supabase.from("users").upsert({
                        id: userData.user?.id,
                        email: userData.user?.email,
                        name: userData.user.user_metadata.full_name,
                    });

                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
                if (!mounted) return;

                setUser(null);
                setIsAuthenticated(false);
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
                if (!mounted) return;

                // Set loading to true when auth state changes
                setLoading(true);

                try {
                    if (session?.user) {
                        const { data: userData } = await supabase.auth.getUser();
                        if (!mounted) return;

                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error("Error in auth state change:", error);
                    if (!mounted) return;

                    setUser(null);
                    setIsAuthenticated(false);
                } finally {
                    if (mounted) {
                        setLoading(false);
                    }
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated }}>
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