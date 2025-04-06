"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRoadmaps } from "@/lib/api";
import Nav from "@/components/client/Nav";
import RoadmapCard from "@/components/client/RoadmapCard";

export default function HomePage() {
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
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Nav />
            <div className="container px-24 my-12">
                <h1 className="text-4xl font-bold mb-12 text-center">Roadmaps</h1>

                {roadmaps.length === 0 ? (
                    <p className="text-center text-gray-500">Makayn walo had sa3a</p>
                ) : (
                    <div className="flex flex-row gap-6 mt-8">
                        {roadmaps.map((roadmap) => (
                            <Link href={`/roadmaps/${roadmap.slug}`} key={roadmap.id}>
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
    );
}
