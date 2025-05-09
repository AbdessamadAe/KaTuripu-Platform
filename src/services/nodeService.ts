import { createClient } from '@/utils/supabase/server';
import Logger from '@/utils/logger';

export async function getNodeExerciseList(nodeId: string) {
    try {
        const supabase = await createClient();
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