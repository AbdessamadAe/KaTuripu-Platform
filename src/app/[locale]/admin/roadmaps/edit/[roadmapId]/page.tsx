"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import RoadmapEditorCanvas from '@/components/admin/RoadmapEditorCanvas';
import { ReactFlowProvider } from '@xyflow/react';
import { useAdminRoadmap, useCreateRoadmap, useUpdateRoadmap, useRoadmapForm } from '@/hooks/index';
import PageHeader from '@/components/admin/PageHeader';
import ActionButtons from '@/components/admin/ActionButtons';
import RoadmapDetailsForm from '@/components/admin/RoadmapDetailsForm';
import AdminErrorState from '@/components/admin/AdminErrorState';

export default function RoadmapEditor({ params }: { params: { roadmapId: string } }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const { roadmapId } = React.use(params);
  const isNewRoadmap = roadmapId === 'new';

  // Fetch roadmap data
  const { data: roadmapData, isLoading, isError } = useAdminRoadmap(roadmapId);
  
  // Mutations for creating and updating roadmaps
  const createMutation = useCreateRoadmap();
  const updateMutation = useUpdateRoadmap();
  
  // Form state management hook
  const { formData, setFormData, handleInputChange } = useRoadmapForm();
  
  // Update form when data is loaded
  useEffect(() => {
    if (roadmapData && !isLoading) {
      setFormData({
        title: roadmapData.title,
        description: roadmapData.description,
        category: roadmapData.category,
        imageUrl: roadmapData.imageUrl
      });
    }
  }, [roadmapData, isLoading, setFormData]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // For a new roadmap, we need to initialize with default values
    const roadmapToSave = isNewRoadmap 
      ? {
          id: '', // Will be generated by the backend
          title: formData.title,
          description: formData.description,
          category: formData.category,
          imageUrl: formData.imageUrl,
          nodes: [],
          edges: []
        }
      : {
          ...roadmapData,
          title: formData.title,
          description: formData.description, 
          category: formData.category,
          imageUrl: formData.imageUrl
        };
    
    try {
      if (isNewRoadmap) {
        await createMutation.mutateAsync(roadmapToSave);
      } else {
        await updateMutation.mutateAsync(roadmapToSave);
      }
      router.push('/admin/roadmaps');
    } catch (error) {
      console.error('Error saving roadmap:', error);
      // You would show an error toast here in a real app
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/roadmaps');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Error loading roadmap"
        description="There was a problem fetching the roadmap data. Please try again later."
        retryAction={() => window.location.reload()}
        backPath="/admin/roadmaps"
        backLabel="Back to Roadmaps"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Roadmaps', href: '/admin/roadmaps' },
              { label: isNewRoadmap ? 'Create New' : 'Edit Roadmap', href: '#' }
            ]} 
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <PageHeader 
            title={isNewRoadmap ? 'Create New Roadmap' : 'Edit Roadmap'} 
          />
          
          <ActionButtons 
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving || createMutation.isPending || updateMutation.isPending}
            primaryLabel="Save Roadmap"
          />
        </div>

        {/* Roadmap metadata form */}
        <RoadmapDetailsForm 
          formData={formData}
          onChange={handleInputChange}
        />

        {/* Roadmap Canvas Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" style={{ height: "70vh" }}>
          <ReactFlowProvider>
            <RoadmapEditorCanvas roadmapId={roadmapId} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}