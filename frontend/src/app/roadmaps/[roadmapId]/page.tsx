import { notFound } from "next/navigation";
import { RoadmapData } from "../../../../components/client/RoadmapViewer";
import ClientRoadmapWrapper from "./client-wrapper";
import { getRoadmapBySlug } from "../../../../lib/api"; // Import the slug function

// This is a server component
export default async function RoadmapPage({ params }: { params: { roadmapId: string } }) {
  const slug = params.roadmapId;
  
  try {
    // Use the slug to get the roadmap
    const data = await getRoadmapBySlug(slug);
    
    if (!data) {
      return notFound();
    }
    
    // Pass the pre-fetched data to the client component
    return (
      <div>
        <h1 className="sr-only">{data.title} Roadmap</h1>
        <ClientRoadmapWrapper roadmapData={data as RoadmapData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching roadmap data:', error);
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl text-red-500">Error loading roadmap</div>
      </div>
    );
  }
}