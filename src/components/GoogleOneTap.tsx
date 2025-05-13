"use client";

import { useEffect } from "react";
import { useUser, GoogleOneTap } from "@clerk/nextjs";

export default function GoogleOneTapWrapper() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    console.log("Mounting Google One Tap, isSignedIn:", isSignedIn);
  }, [isSignedIn]);

  return <GoogleOneTap />;
}
