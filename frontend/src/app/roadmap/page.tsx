"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/client/RoadmapCard";
import * as userService from '@/lib/userService';
import * as roadmapService from '@/lib/roadmapService';
import { motion } from 'framer-motion';
import { useAuth } from "@/contexts/AuthContext";

const RoadmapsPage = () => {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");

    const { user: userData } = useAuth();

    useEffect(() => {
        // Get current user session
        const currentUserId = userData?.id || null;
        if (currentUserId) {
            setUserId(currentUserId);
        }
    }
        , [userData]);

    useEffect(() => {
        async function loadData() {
            try {
                // Get all roadmaps (basic info)
                const roadmapsData = await roadmapService.getAllRoadmaps();
                setRoadmaps(roadmapsData);

                const roadmapDetails = await Promise.all(
                    roadmapsData.map((roadmap) => roadmapService.getRoadmap(roadmap.id))
                );
                console.log("Roadmap details loaded:", roadmapDetails);

                const progressPerMap = await Promise.all(
                    roadmapDetails.map(async (fullRoadmap, index) => {
                        const slug = roadmapsData[index].slug;
                        console.log(fullRoadmap);
                        try {
                            if (fullRoadmap) {
                                const { percentage } = await userService.getRoadmapProgress(userId, fullRoadmap.nodes);
                                // Check if percentage is a number
                                return [slug, percentage];
                            }
                        } catch (e) {
                            console.error(`Error loading progress for ${slug}`, e);
                        }
                        return [slug, 0];
                    })
                );

                setProgressMap(Object.fromEntries(progressPerMap));
            } catch (error) {
                console.error("Erreur lors du chargement des feuilles de route:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [userId]);

    // Helper function to extract all categories from a roadmap
    const getCategoriesFromRoadmap = (roadmap: any): string[] => {
        if (Array.isArray(roadmap.category)) {
            return roadmap.category;
        }

        if (typeof roadmap.category === 'string') {
            return [roadmap.category];
        }

        return ['uncategorized'];
    };

    // Filter roadmaps based on search and category
    const filteredRoadmaps = roadmaps.filter(roadmap => {
        // Check if title or description matches search term
        const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if category matches - accounting for array categories
        let matchesCategory = category === 'all';
        if (!matchesCategory) {
            const roadmapCategories = getCategoriesFromRoadmap(roadmap);
            matchesCategory = roadmapCategories.some(cat =>
                cat.toLowerCase() === category.toLowerCase()
            );
        }

        return matchesSearch && matchesCategory;
    });

    // Get unique categories from all roadmaps
    const allCategories = new Set<string>(['all']);
    roadmaps.forEach(roadmap => {
        getCategoriesFromRoadmap(roadmap).forEach(cat => {
            if (cat) allCategories.add(cat);
        });
    });
    const categories = Array.from(allCategories);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="mt-4 text-lg text-gray-600">Chargement des parcours...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimalist Hero Section */}
            <div className="bg-white py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 font-amiri">Parcours d'Apprentissage</h1>
                        <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto font-amiri">
                            Explorez nos parcours structurés pour maîtriser de nouvelles compétences
                        </p>
                        {!userId && (
                            <Link href="/login" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 inline-block transition-colors">
                                Commencer
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-16">
                {/* Improved Search and Filter Section with better flex layout */}
                <div className="mb-10 flex flex-wrap gap-4">
                    {/* Search input that grows appropriately on different screens */}
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Rechercher un parcours..."
                            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute right-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category filters with horizontal scrolling for small screens */}
                    <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 -mx-1 px-1 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-2 rounded-md whitespace-nowrap text-sm transition-all flex-shrink-0 ${category === cat
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {cat === 'all' ? 'Tous' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRoadmaps.length === 0 ? (
                    <motion.div
                        className="text-center py-12 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-gray-600 mb-3">Aucun parcours ne correspond à votre recherche</p>
                        <button
                            onClick={() => { setSearchTerm(''); setCategory('all'); }}
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredRoadmaps.map((roadmap) => (
                            <motion.div key={roadmap.id} variants={itemVariants} className="w-full">
                                <Link href={`/roadmap/${roadmap.slug}`} className="w-full block">
                                    <RoadmapCard
                                        roadmap={roadmap}
                                        progress={progressMap[roadmap.slug] || 0}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default RoadmapsPage;