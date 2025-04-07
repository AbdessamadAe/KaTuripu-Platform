import { notFound } from "next/navigation";
import { RoadmapData } from "@/lib/types";
import ClientRoadmapWrapper from "./client-wrapper";
import { getRoadmapBySlug } from "@/lib/api";

// Define Params as a Promise
type Params = Promise<{ roadmapSlug: string }>;

export default async function RoadmapPage({ params }: { params: Params }) {
  // Wait for the Promise to resolve
  const resolvedParams = await params;

  if (!resolvedParams?.roadmapSlug) {
    return <div>Loading...</div>;
  }

  try {
    const data = await getRoadmapBySlug(resolvedParams.roadmapSlug);

    if (!data) {
      return notFound();
    }

    return (
      <div>
        <ClientRoadmapWrapper roadmapData={data as RoadmapData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching roadmap data:", error);
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl text-red-500">Error loading roadmap</div>
      </div>
    );
  }
}
