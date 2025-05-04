import { NextRequest, NextResponse } from "next/server";
import { uploadQuestionImage } from "@/services/exerciseService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const exerciseId = formData.get('exerciseId') as string;
    const file = formData.get('file') as File;
    
    if (!exerciseId || !file) {
      return NextResponse.json(
        { error: "Exercise ID and file are required" },
        { status: 400 }
      );
    }
    
    const result = await uploadQuestionImage(exerciseId, file);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json({ imageUrl: result.imageUrl });
  } catch (error) {
    console.error('Error handling image upload:', error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}