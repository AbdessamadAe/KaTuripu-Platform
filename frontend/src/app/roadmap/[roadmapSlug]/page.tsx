import { notFound } from "next/navigation";
import { RoadmapData } from "@/types/types";
import ClientRoadmapWrapper from "./client-wrapper";
import { getRoadmapBySlug } from "@/lib/api";

// Define Params as a Promise
type Params = Promise<{ roadmapSlug: string }>;

export default async function RoadmapPage({ params }: { params: Params }) {
  // Wait for the Promise to resolve
  const resolvedParams = await params;

  if (!resolvedParams?.roadmapSlug) {
    return <div>Chargement...</div>;
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
    console.error("Erreur lors du chargement des données de la feuille de route:", error);
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl text-red-500">Erreur lors du chargement de la feuille de route</div>
      </div>
    );
  }
}
