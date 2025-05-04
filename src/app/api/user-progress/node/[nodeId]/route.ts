import { getUserProgressOnNode } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { nodeId: string } }
) {
    const { nodeId } = await params;
    
    const result = await getUserProgressOnNode(nodeId);
    
    return NextResponse.json(
        result,
        { status: result.status || (result.success ? 200 : 500) }
    );
}