import { createClient } from "@/lib/supabase/server";
import { Exercise } from '@/types/types';
import Logger from "@/utils/logger";

export const getExerciseById = async (exerciseId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", exerciseId)
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, exercise: data };
}