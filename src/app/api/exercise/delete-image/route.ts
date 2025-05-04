import { NextRequest, NextResponse } from "next/server";
import { deleteQuestionImage } from "@/services/exerciseService";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }
    
    const result = await deleteQuestionImage(imageUrl);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling image deletion:', error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}