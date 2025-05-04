import Canvas from "@/components/Canvas";

export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const roadmapId = resolvedparams?.roadmapId;
  return (
    <div>
      <Canvas roadmapId={roadmapId} />
    </div>
  )
}
