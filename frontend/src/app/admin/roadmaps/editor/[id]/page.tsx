"use client";

import { useCallback, useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeEditPanel } from '../../../../../../components/admin/NodeEditPanel';
import { useRouter } from 'next/navigation';
import { RoadmapData, RoadmapNodeType } from '../../../../../components/roadmap';

export default function RoadmapEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load existing roadmap data
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setIsLoading(true);
        
        // In production, this would be an API call
        let data: RoadmapData | null = null;
        
        // If not creating a new roadmap, try to load existing one
        if (params.id !== 'new') {
          try {
            const response = await fetch(`/data/roadmaps/${params.id}.json`);
            if (response.ok) {
              data = await response.json();
            }
          } catch (error) {
            console.error('Error loading roadmap:', error);
          }
        }
        
        if (data) {
          // Set roadmap metadata
          setRoadmapTitle(data.title);
          setRoadmapDescription(data.description);
          
          // Transform nodes for ReactFlow
          const flowNodes = data.nodes.map(node => ({
            id: node.id,
            type: 'default',
            position: node.position,
            data: { 
              label: node.label,
              description: node.description,
              exercises: node.exercises
            }
          }));
          
          // Set the flow elements
          setNodes(flowNodes);
          setEdges(data.edges);
        } else if (params.id === 'new') {
          // Initialize with default values for new roadmap
          setRoadmapTitle('New Roadmap');
          setRoadmapDescription('Roadmap description goes here...');
          
          // Start with an empty canvas
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error('Error setting up editor:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoadmapData();
  }, [params.id, setNodes, setEdges]);
  
  // Handle node click to edit
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);
  
  // Handle edge connections
  const onConnect = useCallback((params: Connection) => {
    const newEdge = { 
      ...params, 
      id: `edge-${params.source}-${params.target}`,
      animated: true 
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  // Add a new node
  const addNewNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    const newNode = {
      id,
      type: 'default',
      data: { 
        label: 'New Node', 
        description: 'Node description...',
        exercises: []
      },
      position: { x: 100, y: 100 },
      style: { 
        background: "#192C88", 
        color: "white", 
        padding: "10px", 
        borderRadius: "5px" 
      }
    };
    
    setNodes(nds => [...nds, newNode]);
  }, [setNodes]);
  
  // Handle saving the roadmap
  const handleSave = useCallback(async () => {
    try {
      // Validate the data
      if (!roadmapTitle.trim()) {
        alert('Please provide a roadmap title');
        return;
      }
      
      // Prepare the data
      const roadmapData: RoadmapData = {
        title: roadmapTitle,
        description: roadmapDescription,
        nodes: nodes.map(n => ({
          id: n.id,
          label: n.data.label,
          description: n.data.description || '',
          exercises: n.data.exercises || [],
          position: n.position
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target
        }))
      };
      
      // In a real app, this would be an API call
      // For now, we'll just log the data
      console.log('Roadmap data to save:', roadmapData);
      
      // Simulate successful save
      alert('Roadmap saved successfully! In a real app, this would save to the database.');
      
      // Redirect to roadmaps admin page
      router.push('/admin/roadmaps');
    } catch (error) {
      console.error('Failed to save roadmap:', error);
      alert('Error saving roadmap');
    }
  }, [nodes, edges, roadmapTitle, roadmapDescription, router]);
  
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading editor...</div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
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
        <div className="space-x-2">
          <button 
            onClick={addNewNode}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Node
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
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
            nodeTypes={{}}
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
