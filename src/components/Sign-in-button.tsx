"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signInWithGoogle } from "@/lib/supabase/actions";

export function SignInButton() {
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className={
        'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ' +
        'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ' +
        'border border-gray-300 dark:border-gray-700 ' +
        'hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md ' +
        'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
      }
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
      Log in
    </button>
  );
}