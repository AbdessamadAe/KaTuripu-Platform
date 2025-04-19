import { notFound } from "next/navigation";
import { RoadmapData } from "@/types/types";
import Roadmap from "@/components/client/RoadmapViewer";

export default function RoadmapPage({ params }: { params: {roadmapSlug: string | undefined} }) {
  const slug = params?.roadmapSlug;

  console.log("slug", slug);

  try {
    return (
      <div>
        <Roadmap roadmapSlug={slug} />
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
