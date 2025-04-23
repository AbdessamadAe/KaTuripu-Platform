"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/RoadmapCard";
import * as roadmapService from '@/lib/services/roadmapService';
import * as userService from '@/lib/services/userService';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { supabase } from "@/lib/db/client";
import { signInWithGoogle } from "@/lib/db/actions";

const getCategoriesFromRoadmap = (roadmap: any): string[] => {
    if (Array.isArray(roadmap.category)) return roadmap.category;
    if (typeof roadmap.category === 'string') return [roadmap.category];
    return ['uncategorized'];
};

const RoadmapsPage = () => {
    const router = useRouter();
    const t = useTranslations('roadmap');
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [user, setUser] = useState<any>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
    
    // Check auth state on component mount
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        
        fetchUser();
        
        // Set up listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );
        
        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase]);

    // Fetch roadmap data once
    useEffect(() => {
        async function loadData() {
            try {
                const roadmapsData = await roadmapService.getAllRoadmaps();
                setRoadmaps(roadmapsData);
            } catch (error) {
                console.error("Erreur lors du chargement des feuilles de route:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Fetch user-specific progress after roadmaps and user are ready
    useEffect(() => {
        if (!user || roadmaps.length === 0) return;

        async function loadProgress() {
            try {
                const entries = await Promise.all(
                    roadmaps.map(async (roadmap) => {
                        try {
                            const progress = await userService.getUserProgressOnRoadmap(user.id, roadmap.id);
                            return [roadmap.slug, progress?.progressPercent || 0];
                        } catch (e) {
                            console.error(`Error loading progress for ${roadmap.slug}`, e);
                            return [roadmap.slug, 0];
                        }
                    })
                );
                setProgressMap(Object.fromEntries(entries));
            } catch (error) {
                console.error("Error fetching progress map", error);
            }
        }

        loadProgress();
    }, [user, roadmaps]);

    // Filtering logic
    const filteredRoadmaps = roadmaps.filter((roadmap) => {
        const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCategory = category === 'all';
        if (!matchesCategory) {
            const roadmapCategories = getCategoriesFromRoadmap(roadmap);
            matchesCategory = roadmapCategories.some(cat =>
                cat.toLowerCase() === category.toLowerCase()
            );
        }

        return matchesSearch && matchesCategory;
    });

    const categories = ["all", "SM", "PC"];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const handleRoadmapClick = (roadmap: any) => {
        if (!user) {
            setSelectedRoadmap(roadmap.slug);
            setShowLoginModal(true);
        } else {
            router.push(`/roadmap/${roadmap.slug}`);
        }
    };

    const closeModal = () => {
        setShowLoginModal(false);
        setSelectedRoadmap(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-12">
            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-11/12 relative border border-[#c5b3ff]/60 dark:border-gray-700/50">
                        {/* Close button */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Decorative elements */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#66c2bc]/30 dark:bg-[#66c2bc]/15 rounded-full blur-xl -z-10"></div>
                        <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#ff9d8a]/30 dark:bg-[#ff9d8a]/15 rounded-full blur-xl -z-10"></div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Please sign in to access this roadmap and track your progress.
                        </p>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={signInWithGoogle}
                                className="flex items-center px-6 py-3 text-base font-medium rounded-xl transition-all 
                                           bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] text-white
                                           hover:from-[#3d699d] hover:to-[#588ac0] shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        <span className="relative">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7d9bbf] to-[#f0b9ae] blur-lg opacity-30"></span>
                            <span className="relative">{t('Concours')}</span>
                        </span>
                    </h1>
                </div>
                
                {/* Search and filter section */}
                <div className="mb-10 max-w-4xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Search bar with styled wrapper */}
                    <div className="relative w-full lg:w-3/5">
                        <div className="relative">
                            {/* Decorative element */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-[#a7d1cf]/40 dark:bg-[#a7d1cf]/20 rounded-full blur-xl opacity-50"></div>
                            
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg focus:shadow-xl focus:ring-2 focus:ring-[#5a8aaf] dark:focus:ring-[#7d9bbf] focus:border-[#5a8aaf] dark:focus:border-[#7d9bbf] outline-none transition dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category filter buttons */}
                    <div className="flex gap-3 overflow-x-auto flex-wrap justify-center lg:justify-end">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                                    category === cat 
                                    ? 'bg-gradient-to-r from-[#5a8aaf] to-[#7d9bbf] text-white shadow-md' 
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
                                }`}
                            >
                                {cat === 'all' ? t('all') : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Roadmap content */}
                <div className="relative">
                    {/* Decorative background elements */}
                    <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-[#a7d1cf]/30 dark:bg-[#a7d1cf]/20 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute -z-10 bottom-1/4 right-1/5 w-72 h-72 bg-[#f0b9ae]/30 dark:bg-[#f0b9ae]/15 rounded-full blur-3xl opacity-40"></div>
                    
                    {filteredRoadmaps.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl shadow-md border border-[#e9e3ff]/60 dark:border-gray-700/50">
                            <div className="w-24 h-24 mx-auto mb-6 bg-[#f5f3ff] dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-[#5a8aaf] dark:text-[#7d9bbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">{t('noRoadmapsFound')}</p>
                            <button
                                onClick={() => { setSearchTerm(''); setCategory('all'); }}
                                className="px-6 py-2.5 bg-[#f5f3ff] dark:bg-[#5a8aaf]/20 text-[#5a8aaf] dark:text-[#7d9bbf] rounded-lg hover:bg-[#e9e3ff] dark:hover:bg-[#5a8aaf]/30 transition-colors"
                            >
                                {t('resetFilters')}
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredRoadmaps.map((roadmap) => (
                                <motion.div key={roadmap.id} variants={itemVariants}>
                                    <div 
                                        onClick={() => handleRoadmapClick(roadmap)} 
                                        className="cursor-pointer"
                                    >
                                        <RoadmapCard roadmap={roadmap} progress={progressMap[roadmap.slug] || 0} />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoadmapsPage;
