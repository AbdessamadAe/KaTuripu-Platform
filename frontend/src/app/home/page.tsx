"use client";

import Link from "next/link";
import { getAllRoadmaps } from "@/lib/api";
import Nav from "@/components/client/Nav";
import CourseCard from "@/components/client/TopicCard";

export default async function HomePage() {
    const roadmaps = await getAllRoadmaps();

    return (
        <div className="w-full">
            <Nav />
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">الخرائط</h1>

                {roadmaps.length === 0 ? (
                    <p className="text-center text-gray-500">No roadmaps available at the moment.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {roadmaps.map((roadmap) => (
                            <Link
                                href={`/roadmaps/${roadmap.slug}`}
                                key={roadmap.id}
                                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition-colors"
                            >
                                <TopicCard topic={roadmap.title} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}