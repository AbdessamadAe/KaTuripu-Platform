import { Roadmap, Exercise, RoadmapNode } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';

// Get the singleton instance

export async function getRoadmaps() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user || userError) {
            console.log('User not authenticated:', userError);
            return { success: false, error: 'Unauthorized' };
        }

        const { data, error } = await supabase
            .from('user_roadmap_progress')
            .select('*')
            .eq('user_id', user?.id)
            .order('roadmap_created_at', { ascending: false });
            
        return { success: true, roadmaps: data };

    } catch (error) {
        return { success: false, error: 'Failed to fetch roadmaps' };
    }
}

export async function createRoadmap() {
}