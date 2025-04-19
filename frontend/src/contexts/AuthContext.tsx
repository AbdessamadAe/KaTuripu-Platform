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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    flow: 'popup'
                }
            });
        } catch (error) {
            console.error("Error during Google login:", error);
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const syncSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    setUser(session.user);
                    setIsAuthenticated(true);

                    // Sync user in your DB
                    await supabase.from("users").upsert({
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name,
                    });
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        syncSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setLoading(true);
                if (session?.user) {
                    setUser(session.user);
                    setIsAuthenticated(true);

                    // Sync user in your DB
                    await supabase.from("users").upsert({
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name,
                    });
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                setLoading(false);
            }
        );

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
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
