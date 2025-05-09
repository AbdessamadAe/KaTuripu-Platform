import { createClient } from "@/utils/supabase/server";
import { Exercise } from '@/types/types';
import Logger from "@/utils/logger";

export const getExerciseById = async (exerciseId: string) => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .rpc('get_exercise_with_status', {
            p_exercise_id: exerciseId,
            p_user_id: user.id
        })
        .single()
    
    if (error) {
        return { success: false, error: 'Failed to fetch exercise' };
    }

    return { success: true, exercise: data };
}


export const completeExercise = async (exerciseId: string) => {
    const supabase = await createClient();
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
        return { success: false, error: 'Failed to complete exercise' };
    }

    return { success: true };
}
