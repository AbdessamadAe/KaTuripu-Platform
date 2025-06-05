import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserMetrics } from "@/services/userService";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify current user has access to this endpoint
    const { userId: currentUserId } = await auth();
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only users can access their own metrics or admins can access any user's metrics
    const requestedUserId = params.userId;
    
    if (currentUserId !== requestedUserId) {
      // For now, simple check - in a real app you'd check if the current user is an admin
      // Additional permission check would be here
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const result = await getUserMetrics(requestedUserId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json(result.metrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user metrics" },
      { status: 500 }
    );
  }
}