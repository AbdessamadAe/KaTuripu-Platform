import supabase from './db';
import { RoadmapData, RoadmapNodeType, Exercise } from './types';
import { v4 as uuidv4 } from 'uuid';

// Fetch roadmap with all nodes and exercises
export async function getRoadmap(id: string): Promise<RoadmapData> {
  const { data: roadmap, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch roadmap: ${error.message}`);

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

  if (nodeError) throw new Error(`Failed to fetch nodes: ${nodeError.message}`);

  // Fetch edges
  const { data: edges, error: edgeError } = await supabase
    .from('roadmap_edges')
    .select('*')
    .eq('roadmap_id', id);

  if (edgeError) throw new Error(`Failed to fetch edges: ${edgeError.message}`);

  return {
    ...roadmap,
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.label,
      description: node.description,
      position: { x: node.position_x, y: node.position_y },
      exercises: node.node_exercises.map((ne: any) => ne.exercises),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source_node_id,
      target: edge.target_node_id,
    })),
  };
}

// Create new roadmap and related nodes/exercises
export async function createRoadmap(roadmapData: RoadmapData) {
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

  if (error) throw new Error(`Failed to create roadmap: ${error.message}`);

  // Create nodes
  for (const node of nodes) {
    const { data: newNode, error: nodeErr } = await supabase
      .from('roadmap_nodes')
      .insert({
        roadmap_id: roadmap.id,
        id: uuidv4(), // Generate new UUID for node
        label: node.label,
        description: node.description,
        position_x: node.position.x,
        position_y: node.position.y,
      })
      .select()
      .single();

    if (nodeErr) throw new Error(`Failed to insert node: ${nodeErr.message}`);

    // Create node-exercise relationships
    for (const exercise of node.exercises) {
      const { error: exErr } = await supabase
        .from('node_exercises')
        .insert({
          node_id: newNode.id,
          exercise_id: exercise.id,
        });

      if (exErr) throw new Error(`Failed to insert node-exercise relationship: ${exErr.message}`);
    }
  }

  // Create edges
  for (const edge of edges) {
    const { error: edgeErr } = await supabase
      .from('roadmap_edges')
      .insert({
        id: uuidv4(), // Generate new UUID for edge
        roadmap_id: roadmap.id,
        source_node_id: edge.source,
        target_node_id: edge.target,
      });

    if (edgeErr) throw new Error(`Failed to insert edge: ${edgeErr.message}`);
  }

  return roadmap;
}

// Update existing roadmap and its content
export async function updateRoadmap(id: string, roadmapData: RoadmapData) {
  const { nodes, edges, ...roadmapFields } = roadmapData;

  const { error: roadmapError } = await supabase
    .from('roadmaps')
    .update(roadmapFields)
    .eq('id', id);

  if (roadmapError) throw new Error(`Failed to update roadmap: ${roadmapError.message}`);

  // Get existing nodes to compare
  const { data: existingNodes } = await supabase
    .from('roadmap_nodes')
    .select('id')
    .eq('roadmap_id', id);

  const existingNodeIds = existingNodes?.map(n => n.id) || [];

  // Update or create nodes
  for (const node of nodes) {
    let nodeId = node.id;
    
    // If node doesn't exist, create it
    if (!existingNodeIds.includes(node.id)) {
      const { data: newNode, error: nodeErr } = await supabase
        .from('roadmap_nodes')
        .insert({
          roadmap_id: id,
          id: node.id,
          label: node.label,
          description: node.description,
          position_x: node.position.x,
          position_y: node.position.y,
        })
        .select()
        .single();

      if (nodeErr) throw new Error(`Failed to create node: ${nodeErr.message}`);
      nodeId = newNode.id;
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
        .eq('id', node.id);

      if (nodeErr) throw new Error(`Failed to update node: ${nodeErr.message}`);
    }

    // Get existing exercises for this node
    const { data: existingExercises } = await supabase
      .from('node_exercises')
      .select('exercise_id')
      .eq('node_id', nodeId);

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
            node_id: nodeId,
            exercise_id: exerciseId,
          });

        if (relErr) {
          console.error('Relationship creation error:', relErr);
          throw new Error(`Failed to create node-exercise relationship: ${relErr.message}`);
        }
      } else {
        // Update existing exercise
        console.log('Updating exercise in database:', exercise); // Debug log
        
        // First, get the current exercise to compare
        const { data: currentExercise, error: fetchErr } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exercise.id)
          .single();

        if (fetchErr) {
          console.error('Error fetching current exercise:', fetchErr);
          throw new Error(`Failed to fetch current exercise: ${fetchErr.message}`);
        }

        // Only update if there are changes
        if (currentExercise) {
          // Create a clean update object with only the changed fields
          const updateData: Partial<Exercise> = {};
          
          if (exercise.name !== currentExercise.name) updateData.name = exercise.name;
          if (exercise.difficulty !== currentExercise.difficulty) updateData.difficulty = exercise.difficulty;
          if (JSON.stringify(exercise.hints) !== JSON.stringify(currentExercise.hints)) updateData.hints = exercise.hints;
          if (exercise.solution !== currentExercise.solution) updateData.solution = exercise.solution;
          if (exercise.video_url !== currentExercise.video_url) updateData.video_url = exercise.video_url;
          
          // Only update if there are actual changes
          if (Object.keys(updateData).length > 0) {
            console.log('Updating exercise with data:', updateData); // Debug log
            
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
    }
  }

  // Update edges
  await supabase.from('roadmap_edges').delete().eq('roadmap_id', id);
  
  for (const edge of edges) {
    const { error: edgeErr } = await supabase
      .from('roadmap_edges')
      .insert({
        id: edge.id,
        roadmap_id: id,
        source_node_id: edge.source,
        target_node_id: edge.target,
      });

    if (edgeErr) throw new Error(`Failed to update edge: ${edgeErr.message}`);
  }
}

export async function getAllRoadmaps() {
  const { data, error } = await supabase.from('roadmaps').select('*');
  if (error) throw new Error(`Failed to fetch roadmaps: ${error.message}`);
  return data;
}

export async function getRoadmapBySlug(slug: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch roadmap by slug: ${error.message}`);
  }

  return getRoadmap(data.id);
}
