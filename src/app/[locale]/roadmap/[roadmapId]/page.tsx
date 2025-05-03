import Roadmap from "@/components/RoadmapViewer";

export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const roadmapId = resolvedparams?.roadmapId;
  return (
    <div>
      <Roadmap roadmapId={roadmapId} />
    </div>
  )
}
