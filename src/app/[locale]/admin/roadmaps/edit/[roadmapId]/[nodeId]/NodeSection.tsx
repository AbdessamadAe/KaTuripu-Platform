"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReactFlowNode } from '@/types/types';
import { useUpdateNode, useDeleteNode } from '@/hooks/index';
import NodeForm from './components/NodeForm';
import NodeMetadataPanel from './components/NodeMetadataPanel';
import ActionButtons from '@/components/admin/ActionButtons';

interface NodeEditorProps {
  node: ReactFlowNode;
  roadmapId: string;
  roadmapTitle: string;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, roadmapId, roadmapTitle }) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    label: node.data.label || '',
    description: node.data.description || '',
    exercises: node.data.exercises || [],
  });
  
  // Mutations
  const updateNodeMutation = useUpdateNode();
  const deleteNodeMutation = useDeleteNode();
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          label: formData.label,
          description: formData.description,
          exercises: formData.exercises,
        }
      };
      
      await updateNodeMutation.mutateAsync(updatedNode);
      router.push(`/admin/roadmaps/edit/${roadmapId}`);
    } catch (error) {
      console.error('Error saving node:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      await deleteNodeMutation.mutateAsync(node.id);
      router.push(`/admin/roadmaps/edit/${roadmapId}`);
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };
  
  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  // Update exercises from parent component
  const updateExercises = (exercises: Exercise[]) => {
    setFormData({
      ...formData,
      exercises
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Node form */}
        <div className="lg:col-span-2">
          <NodeForm
            formData={formData}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Right column: Node metadata */}
        <div className="space-y-6">
          <NodeMetadataPanel node={node} />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          {confirmDelete ? (
            <div className="flex items-center space-x-4">
              <span className="text-red-600 dark:text-red-400">Are you sure?</span>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Delete Node
            </button>
          )}
        </div>
        <ActionButtons
          onCancel={() => router.push(`/admin/roadmaps/edit/${roadmapId}`)}
          onSave={handleSave}
          saveText="Save Node"
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default NodeEditor;
