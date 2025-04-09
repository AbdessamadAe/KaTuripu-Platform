// src/middleware.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.email !== "admin@example.com") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
