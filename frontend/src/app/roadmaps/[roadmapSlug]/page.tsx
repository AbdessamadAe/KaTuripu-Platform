import { notFound } from "next/navigation";
import { RoadmapData } from "@/components/client/RoadmapViewer";
import ClientRoadmapWrapper from "./client-wrapper";
import { getRoadmapBySlug } from "@/lib/api";

export default async function RoadmapPage({
  params,
}: { params?: { roadmapSlug?: string } }) {
  if (!params?.roadmapSlug) {
    return <div>Loading...</div>;
  }

  try {
    const data = await getRoadmapBySlug(params.roadmapSlug);

    if (!data) {
      return notFound();
    }

    return (
      <div>
        <h1 className="sr-only">{data.title} Roadmap</h1>
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
