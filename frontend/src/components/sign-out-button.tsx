"use client";

import { logout } from "@/lib/actions/auth";
import { useState } from "react";

export const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignOut} 
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
};
