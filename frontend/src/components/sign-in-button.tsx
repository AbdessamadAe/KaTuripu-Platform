"use client";

import { login } from "@/lib/actions/auth";
import { useState } from "react";

export const SignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignIn} 
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
    >
      {isLoading ? "Signing in..." : "Sign In With Github"}
    </button>
  );
};