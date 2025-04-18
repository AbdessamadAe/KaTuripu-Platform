"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/client/RoadmapCard";
import * as userService from '@/lib/services/userService';
import * as roadmapService from '@/lib/services/roadmapService';
import { motion } from 'framer-motion';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const getCategoriesFromRoadmap = (roadmap: any): string[] => {
    if (Array.isArray(roadmap.category)) {
        return roadmap.category;
    }
    if (typeof roadmap.category === 'string') {
        return [roadmap.category];
    }
    return ['uncategorized'];
};

const RoadmapsPage = () => {
    const router = useRouter();
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const { user } = useAuth();

    useEffect(() => {
        async function loadData() {
            try {
                const roadmapsData = await roadmapService.getAllRoadmaps();
                setRoadmaps(roadmapsData);

                const roadmapDetails = await Promise.all(
                    roadmapsData.map((roadmap) => roadmapService.getRoadmap(roadmap.id))
                );

                const progressPerMap = await Promise.all(
                    roadmapDetails.map(async (fullRoadmap, index) => {
                        const slug = roadmapsData[index].slug;
                        try {
                            if (fullRoadmap.nodes && user?.id) {
                                const { percentage } = await userService.getRoadmapProgress(user?.id, fullRoadmap.nodes);
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
    }, [user]);

    const filteredRoadmaps = roadmaps.filter(roadmap => {
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
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="mt-4 text-lg text-gray-600">Chargement des parcours...</span>
                </div>
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
                            placeholder="Rechercher un parcours..."
                            className="w-full px-5 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 text-sm rounded-full transition-all whitespace-nowrap ${category === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                            >
                                {cat === 'all' ? 'Tous' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRoadmaps.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Aucun parcours ne correspond à votre recherche</p>
                        <button
                            onClick={() => { setSearchTerm(''); setCategory('all'); }}
                            className="text-blue-600 hover:underline"
                        >
                            Réinitialiser les filtres
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
                                <Link href={`/roadmap/${roadmap.slug}`} onMouseEnter={() => router.prefetch(`/roadmap/${roadmap.slug}`)}>
                                    <RoadmapCard roadmap={roadmap} progress={progressMap[roadmap.slug] || 0} />
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
