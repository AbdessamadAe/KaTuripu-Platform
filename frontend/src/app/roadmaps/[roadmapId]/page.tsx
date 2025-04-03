import { notFound } from "next/navigation";
import { RoadmapData } from "../../../../components/roadmap";
import ClientRoadmapWrapper from "./client-wrapper";

// This is a server component
export default async function RoadmapPage({ params }: { params: { roadmapId: string } }) {
  const roadmapId = params.roadmapId;
  
  try {
    // Fetch data on the server
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/roadmaps/${roadmapId}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch roadmap data for ${roadmapId}`);
    }
    
    const data: RoadmapData = await response.json();
    
    // Pass the pre-fetched data to the client component
    return (
      <div>
        <h1 className="sr-only">{data.title} Roadmap</h1>
        <ClientRoadmapWrapper roadmapData={data} />
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