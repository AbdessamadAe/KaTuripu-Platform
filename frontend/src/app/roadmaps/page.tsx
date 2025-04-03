import Link from "next/link";
import { getAllRoadmaps } from "../../../lib/api";

export default async function RoadmapsList() {
  const roadmaps = await getAllRoadmaps();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Roadmaps</h1>
      
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
              <h2 className="text-xl font-semibold mb-2">{roadmap.title}</h2>
              <p className="text-gray-600">{roadmap.description}</p>
              <div className="mt-4 text-blue-600 font-medium">View Roadmap →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}