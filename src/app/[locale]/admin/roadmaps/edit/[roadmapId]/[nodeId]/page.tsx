"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import { useAdminRoadmap } from '@/hooks/index';
import PageHeader from '@/components/admin/PageHeader';
import AdminErrorState from '@/components/admin/AdminErrorState';
import NodeSection from './NodeSection';
import ExercisesSection from './ExercisesSection';
import { useExercisesByNodeId } from '@/hooks/useExercise';

export default function NodeEditPage({ params }: { params: { roadmapId: string; nodeId: string } }) {
  const router = useRouter();
  const { roadmapId, nodeId } = use(params);
  
  // Fetch roadmap data to get context about the node
  const { data: roadmapData, isLoading: isRoadmapLoading, isError: isRoadmapError } = 
    useAdminRoadmap(roadmapId);
  const {data: nodeExercises} = useExercisesByNodeId(nodeId);

  // Handle loading state
  if (isRoadmapLoading) {
    return <Loader />;
  }

  // Handle error state
  if (isRoadmapError || !roadmapData) {
    return <AdminErrorState message="Failed to load roadmap data" />;
  }

  // Find the node in the roadmap
  const node = roadmapData.nodes.find(n => n.id === nodeId);
  
  // Handle node not found
  if (!node) {
    return <AdminErrorState message={`Node with ID ${nodeId} not found in roadmap`} />;
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Roadmaps', href: '/admin/roadmaps' },
    { label: roadmapData.title, href: `/admin/roadmaps/edit/${roadmapId}` },
    { label: `${node.data.label}`, href: `/admin/roadmaps/edit/${roadmapId}/${nodeId}` },
  ];




  // Handle exercise updates
  const handleUpdateExercises = (exercises: any[]) => {
    // Update node data with new exercises
    // This assumes you're using a state management system
    // or making API calls to update the node data
    if (node && node.data) {
      node.data.exercises = exercises;
      node.data.total_exercises = exercises.length;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <Breadcrumb items={breadcrumbItems} />
      
      <PageHeader 
        title={`${node.data.label}`}
        description={`Edit node details for roadmap: ${roadmapData.title}`}
      />

      <div className="mt-8">
        <NodeSection 
          node={node} 
          roadmapId={roadmapId}
          roadmapTitle={roadmapData.title}
        />
      </div>
      
      <ExercisesSection 
        nodeId={nodeId}
        initialExercises={nodeExercises}
        onUpdateExercises={handleUpdateExercises}
      />
    </div>
  );
}