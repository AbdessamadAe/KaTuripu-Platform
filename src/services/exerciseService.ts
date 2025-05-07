import { createClient } from "@/lib/supabase/server";
import { Exercise } from '@/types/types';
import Logger from "@/utils/logger";
import { cookies as nextCookies } from 'next/headers'

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


export const completeExercise = async (exerciseId: string) => {
    const supabase = await createClient(nextCookies());
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
        return { success: false, error: 'Unauthorized' };
    }
    const { error } = await supabase
        .from("user_exercise_progress")
        .upsert({
            user_id: user.id,
            exercise_id: exerciseId,
            completed: true,
            completed_at: new Date(),
        },
            { onConflict: 'user_id,exercise_id' } // Update if already exists
        );

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
