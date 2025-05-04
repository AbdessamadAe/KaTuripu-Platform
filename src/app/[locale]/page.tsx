"use client";

import Link from 'next/link';
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/home");
}
