"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signInWithGoogle } from "@/lib/db/actions";
export function SignInButton() {

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className={
        'flex w-ful border-gray-700 border rounded-md items-center px-3 py-1 text-sm text-gray-700'
      }
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
      Log in
    </button>
  );
}