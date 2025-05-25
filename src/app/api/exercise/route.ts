import { NextRequest, NextResponse } from "next/server";
import { createExercise } from "@/services/exerciseService";


export async function POST(
  request: NextRequest
) {
  try {
    // Parse the request body
    const body = await request.json();
    const result = await createExercise(body?.data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 400 }
      );
    }
    
    // Return the created exercise
    return NextResponse.json(
      { success: true, exercise: result.exercise },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}