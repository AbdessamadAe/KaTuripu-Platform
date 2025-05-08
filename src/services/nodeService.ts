import { createClient } from '@/lib/supabase/server';
import Logger from '@/utils/logger';
import { cookies as nextCookies } from 'next/headers'

export async function getNodeExerciseList(nodeId: string) {
    try {
        const supabase = await createClient(nextCookies());
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user || userError) {
            return { success: false, error: 'Unauthorized' };
        }
        
        const { data: exercises, error } = await supabase
            .rpc('get_node_exercises_with_status', {
                p_user_id: user.id,
                p_node_id: nodeId
            });
        return { success: true, exerciseList: exercises };

    } catch (error) {
        return { success: false, error: 'Failed to fetch exercise list' };
    }
}