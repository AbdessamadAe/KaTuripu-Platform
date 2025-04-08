"use client";

import { useCallback, useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeEditPanel } from '@/components/admin/NodeEditPanel';
import { useRouter } from 'next/navigation';
import { RoadmapData, RoadmapNodeType, Exercise } from '@/types/types';
import { getRoadmap, createRoadmap, updateRoadmap } from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RoadmapEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [roadmapId, setRoadmapId] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params and set roadmapId
  useEffect(() => {
    params.then((resolvedParams) => {
      setRoadmapId(resolvedParams.id);
    }).catch((err) => {
      setError('Failed to resolve route parameters');
    });
  }, [params]);

  // Load existing roadmap data
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setIsLoading(true);
        
        // If not creating a new roadmap, try to load existing one
        if (roadmapId !== 'new' && roadmapId) {
          try {
            const data = await getRoadmap(roadmapId as any);
            if (data) {
              // Set roadmap metadata
              setRoadmapTitle(data.title);
              setRoadmapDescription(data.description);
              
              // Transform nodes for ReactFlow
              const flowNodes = data.nodes.map((node: RoadmapNodeType) => ({
                id: node.id,
                position: node.position,
                data: { 
                  label: node.label,
                  description: node.description,
                  exercises: node.exercises.map(ex => ({
                    ...ex,
                    hints: ex.hints || [], // Ensure hints is always an array
                  }))
                },
                style: { 
                  background: "#192C88", 
                  color: "white", 
                  padding: "10px", 
                  borderRadius: "5px" 
                }
              }));
              
              // Set the flow elements
              setNodes(flowNodes);
              setEdges(data.edges);
            }
          } catch (error) {
            setError('Failed to load roadmap data');
            console.error('Error loading roadmap data:', error);
            toast.error('Failed to load roadmap data');
          }
        } else {
          // Initialize with default values for new roadmap
          setRoadmapTitle('New Roadmap');
          setRoadmapDescription('Roadmap description goes here...');
          
          // Start with an empty canvas
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error('Error setting up editor:', err);
        setError('An error occurred while setting up the editor');
        toast.error('Failed to set up editor');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoadmapData();
  }, [roadmapId, setNodes, setEdges]);
  
  // Handle node click to edit
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);
  
  // Handle edge connections
  const onConnect = useCallback((params: Connection) => {
    const newEdge = { 
      ...params, 
      id: `edge-${params.source}-${params.target}`,
      animated: true 
    };
    setEdges((eds) =>
      addEdge({ ...newEdge, animated: newEdge.animated ?? false }, eds) as Edge[]
    );    
  }, [setEdges]);
  
  // Add a new node
  const addNewNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    
    // Calculate a position that's not on top of existing nodes
    // Basic approach: offset by number of existing nodes to avoid stacking
    const nodeCount = nodes.length;
    const position = {
      x: 100 + (nodeCount % 4) * 200,  // Distribute horizontally every 200px, 4 columns
      y: 100 + Math.floor(nodeCount / 4) * 150  // New row every 4 nodes, 150px apart
    };
    
    const newNode = {
      id,
      type: 'default',
      data: { 
        label: 'New Node', 
        description: 'Node description...',
        exercises: []
      },
      position,
      style: { 
        background: "#192C88", 
        color: "white", 
        padding: "10px", 
        borderRadius: "5px"
      },
    };
    
    setNodes(nds => [...nds, newNode as Node]);
    
    // Optionally select the newly created node for immediate editing
    setSelectedNode(newNode);
  }, [nodes, setNodes]);
  
  // Add keyboard shortcut for adding nodes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add node on "n" key press (if not in an input/textarea)
      if (e.key === 'n' && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        addNewNode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addNewNode]);
  
  // Handle saving the roadmap
  const handleSave = useCallback(async () => {
    try {
      // Validate the data
      if (!roadmapTitle.trim()) {
        toast.error('Please provide a roadmap title');
        return;
      }
      
      // Prepare the data
      const roadmapData: RoadmapData = {
        title: roadmapTitle,
        description: roadmapDescription,
        slug: generateSlug(roadmapTitle),
        nodes: nodes.map((n: Node): RoadmapNodeType => ({
          id: n.id,
          label: n.data.label as string,
          description: (n.data.description as string) || '',
          exercises: (n.data.exercises as Exercise[]).map(ex => ({
            ...ex,
            hints: ex.hints || [], // Ensure hints is always an array
          })),
          position: n.position,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target
        }))
      };
      
      // Save the roadmap
      if (roadmapId === 'new') {
        await createRoadmap(roadmapData);
        toast.success('New roadmap created successfully!');
      } else {
        if (roadmapId) {
          await updateRoadmap(roadmapId, roadmapData);
          toast.success('Roadmap updated successfully!');
        } else {
          throw new Error('Roadmap ID is null');
        }
      }
      
      // Redirect to roadmaps admin page
      router.push('/admin/roadmaps');
    } catch (error) {
      console.error('Failed to save roadmap:', error);
      toast.error('Error saving roadmap: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [nodes, edges, roadmapTitle, roadmapDescription, router, roadmapId]);
  
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading editor...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Toolbar */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div className="space-y-2 w-1/2">
          <input
            type="text"
            value={roadmapTitle}
            onChange={(e) => setRoadmapTitle(e.target.value)}
            placeholder="Roadmap Title"
            className="w-full p-2 border rounded text-lg"
          />
          <input
            type="text"
            value={roadmapDescription}
            onChange={(e) => setRoadmapDescription(e.target.value)}
            placeholder="Short description"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-x-2 flex items-center">
          <div className="text-xs text-gray-500 mr-2">
            Press <kbd className="bg-gray-200 px-1 py-0.5 rounded">N</kbd> to add a new node
          </div>
          <button 
            onClick={addNewNode}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Node
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Roadmap
          </button>
        </div>
      </div>
      
      {/* Main editor area */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView
          >
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
        
        {/* Node edit panel */}
        {selectedNode && (
          <NodeEditPanel 
            node={selectedNode}
            onChange={(updatedNode) => {
              setNodes(nds => 
                nds.map(n => n.id === selectedNode.id ? updatedNode : n)
              );
              setSelectedNode(updatedNode);
            }}
          />
        )}
      </div>
    </div>
  );
}
