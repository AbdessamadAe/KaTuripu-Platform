"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/RoadmapCard";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Roadmap } from "@/types/types";


async function fetchRoadmaps(): Promise<Roadmap[]> {
    const res = await fetch('/api/roadmap');
    if (!res.ok) {
        throw new Error('Failed to fetch roadmaps');
    }
    const data = await res.json();
    return data.roadmaps;
}

const RoadmapsPage = () => {
    const router = useRouter();
    const t = useTranslations('roadmap');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
    const { user, isAuthenticated, isLoading } = useAuth();
    const categories = ["All"]

    const { data: roadmaps, isLoading: loading } = useQuery({
        queryKey: ['roadmaps'],
        queryFn: fetchRoadmaps,
        refetchOnWindowFocus: false,
        staleTime: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    });
    
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

    const handleRoadmapClick = (roadmap: Roadmap) => {
        router.push(`/roadmap/${roadmap?.id}`);
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
                                className={`px-6 py-3 text-sm font-medium rounded-xl transition-all ${true
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

                    {roadmaps?.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl shadow-md border border-[#e9e3ff]/60 dark:border-gray-700/50">
                            <div className="w-24 h-24 mx-auto mb-6 bg-[#f5f3ff] dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-[#5a8aaf] dark:text-[#7d9bbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">{t('noRoadmapsFound')}</p>
                            <button
                                onClick={() => { setSearchTerm(''); }}
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
                            {roadmaps?.map((roadmap) => (
                                <motion.div key={roadmap?.id} variants={itemVariants}>
                                    <div
                                        onClick={() => handleRoadmapClick(roadmap)}
                                        className="cursor-pointer"
                                    >
                                        <RoadmapCard roadmap={roadmap} progress={roadmap?.progress_percent || 0} />
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
