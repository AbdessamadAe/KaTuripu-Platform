// src/lib/roadmapService.ts
import { createClient } from '@/lib/db/server';
import { RoadmapData, Exercise, RoadmapNodeType } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Normalizes roadmap data to ensure consistent structure
 * @param rawData Raw roadmap data from database
 * @returns Normalized RoadmapData object
 */
function normalizeRoadmapData(rawData: any): RoadmapData {
  // Extract basic roadmap information
  const { id, title, description, slug, category, created_at, updated_at } = rawData;
  
  // Initialize empty arrays for nodes and edges if they don't exist
  const nodes = Array.isArray(rawData.nodes) ? rawData.nodes : [];
  const edges = Array.isArray(rawData.edges) ? rawData.edges : [];

  // Normalize nodes
  const normalizedNodes: RoadmapNodeType[] = nodes.map((node: any) => {
    // Ensure node has valid position data
    const position = {
      x: typeof node.position_x === 'number' ? node.position_x : 
         (node.position && typeof node.position.x === 'number' ? node.position.x : 0),
      y: typeof node.position_y === 'number' ? node.position_y : 
         (node.position && typeof node.position.y === 'number' ? node.position.y : 0)
    };
    
    // Handle exercises
    let exercises: Exercise[] = [];
    
    if (node.node_exercises && Array.isArray(node.node_exercises)) {
      // Extract exercises from node_exercises join table
      exercises = node.node_exercises
        .filter((ne: any) => ne.exercises) // Filter out any null values
        .map((ne: any) => {
          // Normalize exercise data
          const exercise = ne.exercises;
          return {
            id: exercise.id,
            name: exercise.name || '',
            difficulty: exercise.difficulty || 'easy',
            description: exercise.description || '',
            solution: exercise.solution || '',
            hints: Array.isArray(exercise.hints) ? exercise.hints : [],
            video_url: exercise.video_url || '',
            question_image_url: exercise.question_image_url || ''
          };
        });
    } else if (node.exercises && Array.isArray(node.exercises)) {
      // Handle direct exercises array
      exercises = node.exercises.map((ex: any) => ({
        id: ex.id,
        name: ex.name || '',
        difficulty: ex.difficulty || 'easy',
        description: ex.description || '',
        solution: ex.solution || '',
        hints: Array.isArray(ex.hints) ? ex.hints : [],
        video_url: ex.video_url || '',
        question_image_url: ex.question_image_url || ''
      }));
    }
    
    // Return normalized node
    return {
      id: node.id,
      label: node.label || '',
      description: node.description || '',
      position,
      exercises
    };
  });

  // Normalize edges
  const normalizedEdges = edges.map((edge: any) => ({
    id: edge.id,
    source: edge.source_node_id || edge.source,
    target: edge.target_node_id || edge.target
  }));
  
  // Return complete normalized roadmap data
  return {
    id,
    title,
    description,
    slug,
    category,
    created_at,
    updated_at,
    nodes: normalizedNodes,
    edges: normalizedEdges
  };
}

/**
 * Roadmap related service functions
 */

/**
 * Fetch roadmap with all nodes and exercises
 * @param id Roadmap ID
 * @returns Complete roadmap data with nodes and edges
 */
export async function getRoadmapById(id: string): Promise<{ success: boolean, roadmap?: RoadmapData, error?: string, status?: number }> {
  const supabase = await createClient();
  try {
    // For fetching roadmap data, we don't require authentication but we keep consistent return structure
    
    const { data: roadmap, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Roadmap not found', status: 404 };
      }
      return { success: false, error: `Failed to fetch roadmap: ${error.message}`, status: 500 };
    }
    
    if (!roadmap) {
      return { success: false, error: 'Roadmap not found', status: 404 };
    }

    // Fetch nodes with their exercises
    const { data: nodes, error: nodeError } = await supabase
      .from('roadmap_nodes')
      .select(`
        *,
        node_exercises (
          exercise_id,
          exercises (*)
        )
      `)
      .eq('roadmap_id', id);

    if (nodeError) {
      return { success: false, error: `Failed to fetch nodes: ${nodeError.message}`, status: 500 };
    }

    // Fetch edges
    const { data: edges, error: edgeError } = await supabase
      .from('roadmap_edges')
      .select('*')
      .eq('roadmap_id', id);

    if (edgeError) {
      return { success: false, error: `Failed to fetch edges: ${edgeError.message}`, status: 500 };
    }

    // Build and normalize the complete roadmap data
    const rawRoadmapData = {
      ...roadmap,
      nodes,
      edges
    };
    
    const normalizedRoadmap = normalizeRoadmapData(rawRoadmapData);
    return { success: true, roadmap: normalizedRoadmap };
  } catch (error) {
    console.error('Error in getRoadmapById:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Get all available roadmaps
 * @returns Array of roadmap basic information
 */
export async function getAllRoadmaps(): Promise<{ success: boolean, roadmaps?: any[], error?: string, status?: number }> {
  const supabase = await createClient();
  try {
    // For getAllRoadmaps, we allow unauthenticated users to read roadmaps
    // but we keep the response structure consistent with other authenticated endpoints
    
    const { data, error } = await supabase.from('roadmaps').select('*');
    
    if (error) {
      console.error(`Failed to fetch roadmaps: ${error.message}`);
      return { success: false, error: "Failed to fetch roadmaps", status: 500 };
    }
    
    return { success: true, roadmaps: data || [] };
  } catch (error) {
    console.error('Error in getAllRoadmaps:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Create a new roadmap and related nodes/exercises
 * @param roadmapData Complete roadmap data including nodes and edges
 * @returns The created roadmap
 */
export async function createRoadmap(roadmapData: RoadmapData): Promise<{ success: boolean, roadmap?: any, error?: string, status?: number }> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    const { nodes, edges, ...roadmapFields } = roadmapData;

    // Check if slug exists and generate a unique one if needed
    let uniqueSlug = roadmapFields.slug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('roadmaps')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();

      if (!existing) break;
      
      uniqueSlug = `${roadmapFields.slug}-${counter}`;
      counter++;
    }

    const { data: roadmap, error } = await supabase
      .from('roadmaps')
      .insert([{ ...roadmapFields, slug: uniqueSlug }])
      .select()
      .single();

    if (error) {
      console.error(`Failed to create roadmap: ${error.message}`);
      return { success: false, error: "Failed to create roadmap", status: 500 };
    }

    // Map to track original node IDs to new clean UUIDs
    const nodeIdMap: Record<string, string> = {};
    
    // Create nodes
    for (const node of nodes) {
      // Generate a clean UUID for the node
      const nodeId = uuidv4();
      // Store the mapping from original ID to new clean UUID
      nodeIdMap[node.id] = nodeId;
      
      const { data: newNode, error: nodeErr } = await supabase
        .from('roadmap_nodes')
        .insert({
          roadmap_id: roadmap.id,
          id: nodeId,
          label: node.label,
          description: node.description,
          position_x: node.position.x,
          position_y: node.position.y,
        })
        .select()
        .single();

      if (nodeErr) {
        console.error(`Failed to insert node: ${nodeErr.message}`);
        return { success: false, error: "Failed to insert node", status: 500 };
      }

      // Create node-exercise relationships
      for (const exercise of node.exercises) {
        const { error: exErr } = await supabase
          .from('node_exercises')
          .insert({
            node_id: newNode.id,
            exercise_id: exercise.id,
          });

        if (exErr) {
          console.error(`Failed to insert node-exercise relationship: ${exErr.message}`);
          return { success: false, error: "Failed to insert node-exercise relationship", status: 500 };
        }
      }
    }

    // Create edges using the nodeIdMap to translate IDs
    for (const edge of edges) {
      // Use the mapped clean UUIDs for source and target
      const sourceId = nodeIdMap[edge.source] || edge.source;
      const targetId = nodeIdMap[edge.target] || edge.target;
      
      const { error: edgeErr } = await supabase
        .from('roadmap_edges')
        .insert({
          id: uuidv4(), // Generate new UUID for edge
          roadmap_id: roadmap.id,
          source_node_id: sourceId,
          target_node_id: targetId,
        });

      if (edgeErr) {
        console.error(`Failed to insert edge: ${edgeErr.message}`);
        return { success: false, error: "Failed to insert edge", status: 500 };
      }
    }

    return { success: true, roadmap };
  } catch (error) {
    console.error('Error in createRoadmap:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Update an existing roadmap and its content
 * @param id Roadmap ID to update
 * @param roadmapData Updated roadmap data
 */
export async function updateRoadmap(id: string, roadmapData: RoadmapData): Promise<{ success: boolean, error?: string, status?: number }> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    const { nodes, edges, ...roadmapFields } = roadmapData;

    const { error: roadmapError } = await supabase
      .from('roadmaps')
      .update(roadmapFields)
      .eq('id', id);

    if (roadmapError) {
      console.error(`Failed to update roadmap: ${roadmapError.message}`);
      return { success: false, error: "Failed to update roadmap", status: 500 };
    }

    // Get existing nodes to compare
    const { data: existingNodes } = await supabase
      .from('roadmap_nodes')
      .select('id')
      .eq('roadmap_id', id);

    const existingNodeIds = existingNodes?.map(n => n.id) || [];
    
    // Map to track original node IDs to clean UUIDs
    const nodeIdMap: Record<string, string> = {};

    // Update or create nodes
    for (const node of nodes) {
      // Strip 'node-' prefix if present and ensure we have a valid UUID
      const cleanNodeId = node.id.startsWith('node-') ? uuidv4() : node.id;
      // Store mapping from original ID to clean UUID
      nodeIdMap[node.id] = cleanNodeId;
      
      // If node doesn't exist, create it
      if (!existingNodeIds.includes(cleanNodeId)) {
        const { data: newNode, error: nodeErr } = await supabase
          .from('roadmap_nodes')
          .insert({
            roadmap_id: id,
            id: cleanNodeId,
            label: node.label,
            description: node.description,
            position_x: node.position.x,
            position_y: node.position.y,
          })
          .select()
          .single();

        if (nodeErr) throw new Error(`Failed to create node: ${nodeErr.message}`);
      } else {
        // Update existing node
        const { error: nodeErr } = await supabase
          .from('roadmap_nodes')
          .update({
            label: node.label,
            description: node.description,
            position_x: node.position.x,
            position_y: node.position.y,
          })
          .eq('id', cleanNodeId);

        if (nodeErr) throw new Error(`Failed to update node: ${nodeErr.message}`);
      }

      // Get existing exercises for this node
      const { data: existingExercises } = await supabase
        .from('node_exercises')
        .select('exercise_id')
        .eq('node_id', node.id);

      const existingExerciseIds = existingExercises?.map(e => e.exercise_id) || [];

      // Update or create exercises
      for (const exercise of node.exercises) {
        let exerciseId = exercise.id;
        
        // If exercise doesn't exist, create it
        if (!existingExerciseIds.includes(exercise.id)) {
          const { data: newExercise, error: exCreateErr } = await supabase
            .from('exercises')
            .insert({
              id: exercise.id,
              name: exercise.name,
              difficulty: exercise.difficulty,
              hints: exercise.hints || [],
              solution: exercise.solution || '',
              video_url: exercise.video_url || '',
            })
            .select()
            .single();

          if (exCreateErr) {
            console.error('Exercise creation error:', exCreateErr);
            throw new Error(`Failed to create exercise: ${exCreateErr.message}`);
          }
          exerciseId = newExercise.id;

          // Create node-exercise relationship
          const { error: relErr } = await supabase
            .from('node_exercises')
            .insert({
              node_id: node.id,
              exercise_id: exerciseId,
            });

          if (relErr) {
            console.error('Relationship creation error:', relErr);
            throw new Error(`Failed to create node-exercise relationship: ${relErr.message}`);
          }
        } else {
          // Update existing exercise
          const updateData = {
            name: exercise.name,
            difficulty: exercise.difficulty,
            hints: exercise.hints || [],
            solution: exercise.solution || '',
            video_url: exercise.video_url || '',
            question_image_url: exercise.question_image_url || '',
            description: exercise.description
          };
          
          const { error: exUpdateErr } = await supabase
            .from('exercises')
            .update(updateData)
            .eq('id', exercise.id);

          if (exUpdateErr) {
            console.error('Exercise update error:', exUpdateErr);
            throw new Error(`Failed to update exercise: ${exUpdateErr.message}`);
          }
        }
      }
    }

    // Update edges
    await supabase.from('roadmap_edges').delete().eq('roadmap_id', id);
    
    for (const edge of edges) {
      // Use the mapped UUIDs for source and target if available
      const sourceId = nodeIdMap[edge.source] || edge.source;
      const targetId = nodeIdMap[edge.target] || edge.target;
      
      const { error: edgeErr } = await supabase
        .from('roadmap_edges')
        .insert({
          id: uuidv4(), // Generate new UUID for edge to avoid conflicts
          roadmap_id: id,
          source_node_id: sourceId,
          target_node_id: targetId,
        });

      if (edgeErr) throw new Error(`Failed to update edge: ${edgeErr.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateRoadmap:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Delete a roadmap and all its related data
 * @param id Roadmap ID to delete
 * @returns Success status
 */
export async function deleteRoadmap(id: string): Promise<{success: boolean, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    // Continue with deletion operations
    // Delete edges first (due to foreign key constraints)
    const { error: edgesError } = await supabase
      .from('roadmap_edges')
      .delete()
      .eq('roadmap_id', id);

    if (edgesError) throw new Error(`Failed to delete roadmap edges: ${edgesError.message}`);

    // Get all nodes to delete their exercises relationships
    const { data: nodes, error: nodesQueryError } = await supabase
      .from('roadmap_nodes')
      .select('id')
      .eq('roadmap_id', id);

    if (nodesQueryError) throw new Error(`Failed to query roadmap nodes: ${nodesQueryError.message}`);

    // Delete node-exercise relationships
    for (const node of nodes || []) {
      const { error: nodeExercisesError } = await supabase
        .from('node_exercises')
        .delete()
        .eq('node_id', node.id);

      if (nodeExercisesError) throw new Error(`Failed to delete node exercises: ${nodeExercisesError.message}`);
    }

    // Delete nodes
    const { error: nodesError } = await supabase
      .from('roadmap_nodes')
      .delete()
      .eq('roadmap_id', id);

    if (nodesError) throw new Error(`Failed to delete roadmap nodes: ${nodesError.message}`);

    // Finally delete the roadmap
    const { error: roadmapError } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', id);

    if (roadmapError) throw new Error(`Failed to delete roadmap: ${roadmapError.message}`);

    return { success: true };
  } catch (error) {
    console.error('Error in deleteRoadmap:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}