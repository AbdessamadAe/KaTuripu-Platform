import RoadmapCanvas from "@/components/RoadmapCanvas";
export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const roadmapId = resolvedparams?.roadmapId;
  return (
    <div>
      <RoadmapCanvas roadmapId={roadmapId} />
    </div>
  )
}
