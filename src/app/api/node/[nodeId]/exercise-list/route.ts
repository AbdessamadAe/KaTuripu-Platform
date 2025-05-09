import { getNodeExerciseList } from "@/services/nodeService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest, 
  { params } : { params: Promise<{ nodeId: string }> }
) {
  
  const {nodeId} = await params;
  const result = await getNodeExerciseList(nodeId);

  if (!result.success) {
    return NextResponse.json({ error: result.error });
  }

  return NextResponse.json(result?.exerciseList);
}