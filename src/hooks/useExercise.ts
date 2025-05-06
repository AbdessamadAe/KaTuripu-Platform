import React, { useState, useEffect } from "react";
import Logger from "@/utils/logger";

export function useExercise(exerciseId?: string) {
    const [exercise, setExercise] = useState<any>();
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (!exerciseId) return;
      const fetchExercise = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/exercise/${exerciseId}`);
          const data = await res.json();
          if (data) {
            setExercise(data);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchExercise();
    }, [exerciseId]);
  
    return { exercise, setExercise, loading };
  }
  