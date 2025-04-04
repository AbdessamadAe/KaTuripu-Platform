"use server";

import { auth } from "@/auth";
import Link from 'next/link';
import { redirect } from "next/navigation";

export default async function Home() {

  // // This part runs on the server
  // const session = await auth();
  
  // // Restrict access if not logged in or not the allowed user
  // if (!session?.user || session.user.email !== "admin@example.com") {
  //   redirect("/login");
  // }

  
  redirect("/home");
}
