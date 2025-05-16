import { NextRequest, NextResponse } from "next/server";
import { createExercise } from "@/services/exerciseService";


export async function POST(
  request: NextRequest
) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.difficulty || !Array.isArray(body.hints)) {
      return NextResponse.json(
        { error: "Missing required fields: name, difficulty, and hints are required" },
        { status: 400 }
      );
    }
    
    // Call the service function to create the exercise
    const result = await createExercise(body);
    
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