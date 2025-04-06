"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRoadmaps } from "@/lib/api";
import Nav from "@/components/client/Nav";
import RoadmapCard from "@/components/client/RoadmapCard";

const RoadmapsPage = () => {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getAllRoadmaps();
            setRoadmaps(data);
            setLoading(false);

            const savedProgress = JSON.parse(localStorage.getItem("roadmapProgress") || "{}");

            const progressPerRoadmap: { [slug: string]: number } = {};

            data.forEach((roadmap: any) => {
                let completed = 0;
                let total = 0;

                roadmap.nodes.forEach((node: any) => {
                    node.exercises.forEach((ex: any) => {
                        total++;
                        if (savedProgress[node.id]?.[ex.id]) completed++;
                    });
                });

                progressPerRoadmap[roadmap.slug] = total === 0 ? 0 : Math.round((completed / total) * 100);
            });

            setProgressMap(progressPerRoadmap);
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <>
                <Nav/>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav/>
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
                                <Link href={`/roadmaps/${roadmap.slug}`} key={roadmap.id} className="w-full">
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