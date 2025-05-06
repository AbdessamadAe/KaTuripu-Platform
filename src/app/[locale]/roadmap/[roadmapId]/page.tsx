import RoadmapCanvas from "@/components/RoadmapCanvas";
import { ReactFlowProvider } from "@xyflow/react";
export default async function RoadmapPage({ params }: any) {
  const resolvedparams = await params;
  const roadmapId = resolvedparams?.roadmapId;
  return (
    <div>
      <ReactFlowProvider>
        <RoadmapCanvas roadmapId={roadmapId} />
      </ReactFlowProvider>
    </div>
  )
}
