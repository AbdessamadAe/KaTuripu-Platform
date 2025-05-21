"use client";

import { useState, useMemo } from "react";
import RoadmapCard from "@/components/RoadmapCard";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { RoadmapMeta } from "@/types/types";
import ErrorMessage from "@/components/Error";
import { useRoadmaps } from "@/hooks/useRoadmap";
import Loader from "@/components/Loader";
import { Button, Input, Badge } from "@/components/ui";

const RoadmapsPage = () => {
    const router = useRouter();
    const t = useTranslations('roadmap');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { data: roadmaps, isLoading: loading, isError } = useRoadmaps();

    const categories = ["All", "SM", "PC"];
    
    const filteredRoadmaps = useMemo(() => {
        if (!roadmaps || !Array.isArray(roadmaps)) return [];
        
        return roadmaps.filter(roadmap => {
            // Make sure we have the properties before trying to filter
            const roadmapTitle = roadmap?.roadmap_title || "";
            const roadmapDesc = roadmap?.roadmap_description || "";
            const roadmapCategory = roadmap?.roadmap_category || "";
            
            const matchesSearch = searchTerm === "" || 
                               roadmapTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               roadmapDesc.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === "All" || 
                                roadmapCategory === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [roadmaps, searchTerm, selectedCategory]);

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

    const handleRoadmapClick = (roadmap: RoadmapMeta) => {
        router.push(`/roadmap/${roadmap?.roadmap_id}`);
    };

    if (loading) {
        return <Loader />;
    }

    if (isError && !loading) return <ErrorMessage/>;

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
                    {/* Debug info */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {roadmaps ? `Found ${filteredRoadmaps.length} roadmaps` : 'No roadmaps data'}
                    </div>
                </div>

                {/* Search and filter section */}
                <div className="mb-10 max-w-4xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Search bar with styled wrapper */}
                    <div className="relative w-full lg:w-3/5">
                        <div className="relative">
                            {/* Decorative element */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-[#a7d1cf]/40 dark:bg-[#a7d1cf]/20 rounded-full blur-xl opacity-50"></div>

                            <Input
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                                fullWidth
                                size="lg"
                                className="shadow-lg focus:shadow-xl"
                            />
                        </div>
                    </div>

                    {/* Category filter buttons */}
                    <div className="flex gap-3 overflow-x-auto flex-wrap justify-center lg:justify-end">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                variant={selectedCategory === cat ? "primary" : "secondary"}
                                size="md"
                            >
                                {cat === 'All' ? t('all') : cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Roadmap content */}
                <div className="relative">
                    {/* Decorative background elements */}
                    <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-[#a7d1cf]/30 dark:bg-[#a7d1cf]/20 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute -z-10 bottom-1/4 right-1/5 w-72 h-72 bg-[#f0b9ae]/30 dark:bg-[#f0b9ae]/15 rounded-full blur-3xl opacity-40"></div>

                    {!roadmaps || filteredRoadmaps.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-2xl shadow-md border border-[#e9e3ff]/60 dark:border-gray-700/50">
                            <div className="w-24 h-24 mx-auto mb-6 bg-[#f5f3ff] dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-[#5a8aaf] dark:text-[#7d9bbf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                                {!roadmaps ? 'No roadmaps available.' : t('noRoadmapsFound')}
                            </p>
                            <Button
                                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                variant="outline"
                                size="md"
                            >
                                {t('resetFilters')}
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={selectedCategory} // Re-animate when category changes
                        >
                            {filteredRoadmaps.map((roadmap) => (
                                <motion.div key={roadmap?.roadmap_id} variants={itemVariants}>
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
