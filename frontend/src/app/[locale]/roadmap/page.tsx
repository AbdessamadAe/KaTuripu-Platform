"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/RoadmapCard";
import * as roadmapService from '@/lib/services/roadmapService';
import * as userService from '@/lib/services/userService';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import createClientForBrowser from "@/lib/db/client";

const getCategoriesFromRoadmap = (roadmap: any): string[] => {
    if (Array.isArray(roadmap.category)) return roadmap.category;
    if (typeof roadmap.category === 'string') return [roadmap.category];
    return ['uncategorized'];
};

const RoadmapsPage = () => {
    const supabase = createClientForBrowser();
    const router = useRouter();
    const t = useTranslations('roadmap');
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [user, setUser] = useState<any>(null);
    
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white text-gray-800 font-sans">
            <div className="container mt-12 mx-auto px-4 md:px-8 lg:px-16 pb-16">
                <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="relative w-full lg:w-1/2">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full px-5 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 text-sm rounded-full transition-all whitespace-nowrap ${category === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                            >
                                {cat === 'all' ? t('all') : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRoadmaps.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">{t('noRoadmapsFound')}</p>
                        <button
                            onClick={() => { setSearchTerm(''); setCategory('all'); }}
                            className="text-blue-600 hover:underline"
                        >
                            {t('resetFilters')}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredRoadmaps.map((roadmap) => (
                            <motion.div key={roadmap.id} variants={itemVariants}>
                                <Link 
                                  href={`/roadmap/${roadmap?.slug}`} 
                                  prefetch={false}
                                  onMouseEnter={() => {
                                    router.prefetch(`/roadmap/${roadmap?.slug}`);
                                  }}>
                                    <RoadmapCard roadmap={roadmap} progress={progressMap[roadmap.slug] || 0} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RoadmapsPage;
