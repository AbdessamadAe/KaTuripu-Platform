"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const signInWith = (provider: "google") => async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: {
        prompt: 'select_account',
      }
    },
  });

  if (error) throw error;
  if (data.url) redirect(data.url);
};

export const signInWithGoogle = signInWith("google");

export const handleSignOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};