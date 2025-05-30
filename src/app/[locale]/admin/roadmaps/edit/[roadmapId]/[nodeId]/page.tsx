"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import { useAdminRoadmap } from '@/hooks/index';
import AdminErrorState from '@/components/admin/AdminErrorState';
import NodeSection from './NodeSection';
import ExercisesSection from './ExercisesSection';
import { useExercisesByNodeId } from '@/hooks/exercise/queries/useExercise';

export default function NodeEditPage({ params }: { params: { roadmapId: string; nodeId: string } }) {
  const router = useRouter();
  const { roadmapId, nodeId } = use(params);
  
  // Fetch roadmap data to get context about the node
  const { data: roadmapData, isLoading: isRoadmapLoading, isError: isRoadmapError } = 
    useAdminRoadmap(roadmapId);
  const {data: nodeExercises, isLoading: isExercisesLoading, isError: isExercisesError} = useExercisesByNodeId(nodeId);

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
    { name: 'Admin', href: '/admin' },
    { name: 'Roadmaps', href: '/admin/roadmaps' },
    { name: roadmapData.title, href: `/admin/roadmaps/edit/${roadmapId}` },
    { name: node.data.label, href: `/admin/roadmaps/edit/${roadmapId}/${nodeId}` },
  ];


  return (
    <div className="container mx-auto px-4 mb-18 max-w-7xl">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8">
        <NodeSection 
          node={node} 
          roadmapId={roadmapId}
          roadmapTitle={roadmapData.title}
        />
      </div>
      
      <ExercisesSection 
        nodeId={nodeId}
        exercises={nodeExercises}
        isLoading={isExercisesLoading}
        isError={isExercisesError}
      />
    </div>
  );
}