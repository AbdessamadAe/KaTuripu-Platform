"use client";

import supabase from "@/lib/db/supabase";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

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
    <button
      onClick={handleGoogleSignIn}
      className={
        'flex w-ful border-sky-600 border-2 rounded-xs items-center px-3 py-1 text-sm text-gray-700'
      }
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
      Log in
    </button>
  );
}