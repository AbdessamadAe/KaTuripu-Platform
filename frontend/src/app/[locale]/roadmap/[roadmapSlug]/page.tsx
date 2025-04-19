import Roadmap from "@/components/client/RoadmapViewer";

export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const slug = resolvedparams?.roadmapSlug;
  return (
    <div>
      <Roadmap roadmapSlug={slug} />
    </div>
  )
}
