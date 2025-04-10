"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/client/RoadmapCard";
import supabase from "@/lib/supabase";
import * as userService from '@/lib/userService';
import * as roadmapService from '@/lib/roadmapService';

const RoadmapsPage = () => {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                // Get current user session
                const { data: { session } } = await supabase.auth.getSession();
                const currentUserId = session?.user?.id || null;
                setUserId(currentUserId);
                
                // Get all roadmaps (basic info)
                const roadmapsData = await roadmapService.getAllRoadmaps();
                setRoadmaps(roadmapsData);
                
                // Initialize progress map
                const progressPerRoadmap: { [slug: string]: number } = {};
                
                // For each roadmap, load full details to calculate progress
                for (const roadmap of roadmapsData) {
                    try {
                        const fullRoadmap = await roadmapService.getRoadmap(roadmap.id);
                        
                        if (fullRoadmap.nodes && fullRoadmap.nodes.length > 0) {
                            // If user is logged in, calculate progress using userService
                            if (currentUserId) {
                                const { percentage } = await userService.getRoadmapProgress(
                                    currentUserId,
                                    fullRoadmap.nodes
                                );
                                progressPerRoadmap[roadmap.slug] = percentage;
                            } else {
                                progressPerRoadmap[roadmap.slug] = 0;
                            }
                        } else {
                            progressPerRoadmap[roadmap.slug] = 0;
                        }
                    } catch (error) {
                        console.error(`Error loading full roadmap ${roadmap.id}:`, error);
                        progressPerRoadmap[roadmap.slug] = 0;
                    }
                }
                
                setProgressMap(progressPerRoadmap);
            } catch (error) {
                console.error("Error loading roadmaps:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">الخرائط</h1>
                        <p className="text-gray-600 text-lg font-amiri">اختر الخريطة التي تريد البدء بها</p>
                    </div>
                    
                    {roadmaps.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">لا توجد دورات متاحة حالياً</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center px-12">
                            {roadmaps.map((roadmap) => (
                                <Link href={`/roadmap/${roadmap.slug}`} key={roadmap.id} className="w-full">
                                    <RoadmapCard
                                        roadmap={roadmap}
                                        progress={progressMap[roadmap.slug] || 0}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default RoadmapsPage;