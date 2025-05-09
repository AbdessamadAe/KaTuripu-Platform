import { Roadmap, Exercise } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/server';
import Logger from '@/utils/logger';


export async function getRoadmaps() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user || userError) {
            return { success: false, error: 'Unauthorized' };
        }

        const { data, error } = await supabase
            .from('user_roadmap_progress')
            .select('*')
            .eq('user_id', user?.id)
            .order('roadmap_created_at', { ascending: false });
      
      if (error) {
        Logger.error('Error fetching roadmaps',
            error,
            'FETCH_ROADMAPS_ERROR',
            'getRoadmaps',
            user.id
        );
      }
      
            
        return { success: true, roadmaps: data };

    } catch (error) {
        return { success: false, error: 'Failed to fetch roadmaps' };
    }
}


export async function geFullRoadmapWithProgress(roadmapId: string) {
  try {
      const supabase = await createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!user || userError) {
          return { success: false, error: 'Unauthorized' };
      }

      const { data, error} = await supabase
          .rpc('get_full_roadmap_with_progress', {
          p_user_id: user.id,
          p_roadmap_id: roadmapId
          });
        
      return { success: true, roadmap: data?.roadmap };

  } catch (error) {
      return { success: false, error: 'Failed to fetch roadmap' };
  }
}