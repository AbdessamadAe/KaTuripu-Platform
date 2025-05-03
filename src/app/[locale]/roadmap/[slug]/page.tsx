import Roadmap from "@/components/RoadmapViewer";

export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const slug = resolvedparams?.slug;
  return (
    <div>
      <Roadmap roadmapSlug={slug} />
    </div>
  )
}
