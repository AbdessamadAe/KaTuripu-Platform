import { getNodeExerciseList } from "@/services/nodeService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { nodeId: string } }) {
  const {nodeId} = await params;
  const result = await getNodeExerciseList(nodeId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result?.exerciseList);
}