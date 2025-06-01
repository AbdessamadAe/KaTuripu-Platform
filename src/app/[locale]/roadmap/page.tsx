"use client";

import { useState, useMemo } from "react";
import RoadmapCard from "@/components/RoadmapCard";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { RoadmapMeta } from "@/types/types";
import ErrorMessage from "@/components/Error";
import { useRoadmaps } from "@/hooks/roadmap/queries/useRoadmap";
import Loader from "@/components/Loader";
import { Button, Input, Badge, Select } from "@/components/ui";

const RoadmapsPage = () => {
    const router = useRouter();
    const t = useTranslations('roadmap');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("all");
    const [selectedSpecialContent, setSelectedSpecialContent] = useState("all");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [sortBy, setSortBy] = useState("relevance");

    const { data: roadmaps, isLoading: loading, isError } = useRoadmaps();

    const filteredRoadmaps = useMemo(() => {
        if (!roadmaps || !Array.isArray(roadmaps)) return [];

        // First, filter the roadmaps
        const filtered = roadmaps.filter(roadmap => {
            const roadmapTitle = roadmap?.roadmap_title || "";
            const roadmapDesc = roadmap?.roadmap_description || "";
            const roadmapCategory = roadmap?.roadmap_category || "";
            const roadmapDuration = roadmap?.duration || 1;

            // Search term filter
            const matchesSearch = searchTerm === "" ||
                roadmapTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                roadmapDesc.toLowerCase().includes(searchTerm.toLowerCase());


            // Duration filter - adjust according to your data
            const matchesDuration = selectedDuration === "all" ||
                (roadmapDuration <= 3 && selectedDuration.toLowerCase() === "short") ||
                (roadmapDuration <= 10 && selectedDuration.toLowerCase() === "medium") ||
                (roadmapDuration > 10 && selectedDuration.toLowerCase() === "long");

            // Special content filter - you might need to add logic for featured/new/popular
            const matchesSpecialContent = selectedSpecialContent === "all";

            // Active filter (All, In Progress, Completed)
            const progress = roadmap?.progress_percent || 0;
            const matchesActiveFilter =
                selectedFilter === "all" ||
                (selectedFilter === "in-progress" && progress > 0 && progress < 100) ||
                (selectedFilter === "completed" && progress === 100);

            return matchesSearch &&
                matchesDuration &&
                matchesSpecialContent &&
                matchesActiveFilter;
        });

        // Then, sort the filtered roadmaps
        if (sortBy === 'newest') {
            return [...filtered].sort((a, b) => {
                const dateA = new Date(a?.roadmap_created_at || 0);
                const dateB = new Date(b?.roadmap_created_at || 0);
                return dateB.getTime() - dateA.getTime(); // Descending (newer first)
            });
        } else if (sortBy === 'oldest') {
            return [...filtered].sort((a, b) => {
                const dateA = new Date(a?.roadmap_created_at || 0);
                const dateB = new Date(b?.roadmap_created_at || 0);
                return dateA.getTime() - dateB.getTime(); // Ascending (older first)
            });
        }

        // Default sorting (relevance) - return as is
        return filtered;
    }, [roadmaps, searchTerm, selectedDuration, selectedSpecialContent, selectedFilter, sortBy]);

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

    if (isError && !loading) return <ErrorMessage />;

    return (
        <div className="min-h-screen px-24 bg-gradient-to-b from-white to-[var(--primary-color-light)]/30 dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search and filter section */}
                <div className="mb-10 max-w-full mx-auto flex flex-col gap-4">
                    {/* Filter row */}
                    <div className="flex flex-wrap gap-5 items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Browse</h2>
                        {/* Duration dropdown */}
                        <div className="w-full sm:w-auto min-w-[220px]">
                            <Select
                                options={[
                                    { value: 'all', label: 'Duration' },
                                    { value: 'short', label: 'Short (< 3 hour)' },
                                    { value: 'medium', label: 'Medium (1-10 hours)' },
                                    { value: 'long', label: 'Long (> 10 hours)' },
                                ]}
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                            />
                        </div>

                        {/* Special Content dropdown */}
                        <div className="w-full sm:w-auto min-w-[180px]">
                            <Select
                                options={[
                                    { value: 'all', label: 'Special Content' },
                                    { value: 'featured', label: 'Featured' },
                                    { value: 'new', label: 'New' },
                                    { value: 'popular', label: 'Popular' },
                                ]}
                                value={selectedSpecialContent}
                                onChange={(e) => setSelectedSpecialContent(e.target.value)}
                            />
                        </div>

                        {/* Clear filters button */}
                        <div className="ml-auto">
                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSelectedDuration('all');
                                    setSelectedSpecialContent('all');
                                    setSelectedFilter('all');
                                    setSortBy('relevance');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Search and sort row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search input */}
                        <div className="flex-grow relative">
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
                                size="md"
                            />
                        </div>

                        {/* Sort by dropdown */}
                        <div className="w-full sm:w-auto min-w-[150px]">
                            <Select
                                options={[
                                    { value: 'relevance', label: 'Sort by' },
                                    { value: 'newest', label: 'Newest' },
                                    { value: 'oldest', label: 'Oldest' },
                                ]}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Navigation tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mt-2">
                        <div className="flex space-x-8">
                            <button
                                className={`py-2 border-b-2 ${selectedFilter === 'all'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)] dark:text-[var(--secondary-color)] dark:border-[var(--secondary-color)]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} font-medium`}
                                onClick={() => setSelectedFilter('all')}
                            >
                                All Learning Paths
                            </button>
                            <button
                                className={`py-2 border-b-2 ${selectedFilter === 'in-progress'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)] dark:text-[var(--secondary-color)] dark:border-[var(--secondary-color)]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} font-medium`}
                                onClick={() => setSelectedFilter('in-progress')}
                            >
                                In Progress
                            </button>
                            <button
                                className={`py-2 border-b-2 ${selectedFilter === 'completed'
                                    ? 'border-[var(--primary-color)] text-[var(--primary-color)] dark:text-[var(--secondary-color)] dark:border-[var(--secondary-color)]'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} font-medium`}
                                onClick={() => setSelectedFilter('completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </div>

                {/* Roadmap content */}
                <div className="relative">
                    {/* Decorative background elements */}
                    <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-[var(--secondary-color)]/30 dark:bg-[var(--secondary-color)]/20 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute -z-10 bottom-1/4 right-1/5 w-72 h-72 bg-[var(--primary-color)]/30 dark:bg-[var(--primary-color)]/15 rounded-full blur-3xl opacity-40"></div>

                    {!roadmaps || filteredRoadmaps.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--primary-color-light)]/30 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-[var(--primary-color)] dark:text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                                {!roadmaps ? 'No roadmaps available.' : t('noRoadmapsFound')}
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSelectedDuration('all');
                                    setSelectedSpecialContent('all');
                                    setSelectedFilter('all');
                                    setSortBy('relevance');
                                }}
                                variant="outline"
                                size="md"
                            >
                                {t('resetFilters')}
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            className="flex flex-wrap gap-5 justify-center md:justify-start"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={`${selectedFilter}-${sortBy}`} // Re-animate when category, filter or sort changes
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
