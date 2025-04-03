import supabase from './db';
import { RoadmapData } from '../components/client/RoadmapViewer';

// Function to save an existing roadmap
export async function saveRoadmap(id: string, roadmapData: RoadmapData) {
  const { error } = await supabase
    .from('roadmaps')
    .update(roadmapData)
    .eq('id', id);

  if (error) throw new Error(`Failed to save roadmap: ${error.message}`);
}

// Function to create a new roadmap
export async function createRoadmap(roadmapData: RoadmapData) {
  const { data, error } = await supabase
    .from('roadmaps')
    .insert([roadmapData])
    .select()
    .single();

  if (error) throw new Error(`Failed to create roadmap: ${error.message}`);
  return data;
}

// Function to get all roadmaps
export async function getAllRoadmaps() {
  const { data, error } = await supabase.from('roadmaps').select('*');

  if (error) throw new Error(`Failed to fetch roadmaps: ${error.message}`);
  return data;
}

// Function to get a single roadmap
export async function getRoadmap(id: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch roadmap: ${error.message}`);
  return data;
}

// Function to get a roadmap by slug
export async function getRoadmapBySlug(slug: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch roadmap by slug: ${error.message}`);
  }
  return data;
}

// Subject-related functions
export async function getSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*');
  
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  return data;
}

// Topic-related functions
export async function getTopics() {
  const { data, error } = await supabase
    .from('topics')
    .select('*');
  
  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
  
  return data;
}

export async function getTopicsBySubject(subjectId: number) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('subjectId', subjectId);
  
  if (error) {
    console.error('Error fetching topics by subject:', error);
    return [];
  }
  
  return data;
}

// Content-related functions
export async function getTopicContent(topicId: number) {
  const { data, error } = await supabase
    .from('topic_contents')
    .select('*')
    .eq('topicId', topicId)
    .single();
  
  if (error) {
    console.error('Error fetching topic content:', error);
    return null;
  }
  
  return data;
}

// Admin functions
export async function createSubject(subjectData: any) {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subjectData])
    .select();
  
  if (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
  
  return data;
}

export async function updateSubject(id: number, subjectData: any) {
  const { data, error } = await supabase
    .from('subjects')
    .update(subjectData)
    .eq('subjectId', id)
    .select();
  
  if (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
  
  return data;
}

export async function deleteSubject(id: number) {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('subjectId', id);
  
  if (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
  
  return true;
}

// Similar functions for topics and content
export async function createTopic(topicData: any) {
  const { data, error } = await supabase
    .from('topics')
    .insert([topicData])
    .select();
  
  if (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
  
  return data;
}

export async function updateTopic(id: number, topicData: any) {
  const { data, error } = await supabase
    .from('topics')
    .update(topicData)
    .eq('topicId', id)
    .select();
  
  if (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
  
  return data;
}

export async function deleteTopic(id: number) {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('topicId', id);
  
  if (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
  
  return true;
}