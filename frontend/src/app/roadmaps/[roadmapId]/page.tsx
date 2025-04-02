import { notFound } from "next/navigation";
import Roadmap from "../../../../components/roadmap";

const roadmaps = {
  "math-sm": { title: "BAC Math Sciences Mathématiques", content: "Full curriculum..." },
  "cs-fundamentals": { title: "Computer Science Fundamentals", content: "Topics in CS..." },
};

export default function RoadmapPage({ params }: { params: { roadmapId: string } }) {
  const roadmap = roadmaps[params.roadmapId];

  if (!roadmap) return notFound(); // Handle invalid IDs

  return (
    <div>
      <Roadmap/>
    </div>
  );
}