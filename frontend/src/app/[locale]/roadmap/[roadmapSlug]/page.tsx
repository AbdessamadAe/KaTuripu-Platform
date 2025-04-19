import Roadmap from "@/components/client/RoadmapViewer";

export default function RoadmapPage({ params }: any) {
  const slug = params?.roadmapSlug;
  return (
    <div>
      <Roadmap roadmapSlug={slug} />
    </div>
  )
}
