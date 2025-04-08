import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userState = await prisma.userGamificationState.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!userState) {
      // Create initial state if none exists
      const initialState = {
        points: 0,
        level: 1,
        streak: 0,
        lastStreakUpdate: new Date().toISOString(),
        achievements: [],
        exercisesCompleted: {},
        roadmapsStarted: [],
        roadmapsCompleted: [],
      };

      await prisma.userGamificationState.create({
        data: {
          userId: session.user.id,
          state: initialState,
        },
      });

      return NextResponse.json(initialState);
    }

    return NextResponse.json(userState.state);
  } catch (error) {
    console.error("Error fetching gamification state:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const state = await request.json();

    await prisma.userGamificationState.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        state,
      },
      create: {
        userId: session.user.id,
        state,
      },
    });

    return new NextResponse("State updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating gamification state:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 