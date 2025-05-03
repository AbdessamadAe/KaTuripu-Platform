import { getUserProgressOnNode } from "@/services/userService";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

export async function GET(
    request: Request,
    { params }: { params: { nodeId: string } }
) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.id) {
        return NextResponse.json({success: false, error: "Unauthorized"}, {status: 401});
    }
    
    const userProgressOnNode = await getUserProgressOnNode(user.id, params.nodeId);
    if (!userProgressOnNode) {
        return NextResponse.json(
            { success: false, error: "Node Not Found" },
            { status: 404 }
        );
    }

    return NextResponse.json({success: true, userProgressOnNode});
}