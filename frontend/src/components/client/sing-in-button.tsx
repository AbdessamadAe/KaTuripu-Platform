"use client";

import supabase from "@/lib/supabase";

export function SignInButton() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in
    </button>
  );
}