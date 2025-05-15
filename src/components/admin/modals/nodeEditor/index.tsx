import React, { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Exercise } from "@/types/types";
import ExerciseEditorModal from "../../ExerciseEditorModal";

// Import sub-components
import Header from "./Header";
import NodeInfoForm from "./NodeInfoForm";
import NodeMetadata from "./NodeMetadata";
import ExerciseList from "./ExerciseList";
import Footer from "./Footer";

interface NodeEditorProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { label: string; description: string; exercises: Exercise[] }) => void;
  onDelete: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    label: "",
    description: ""
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise> | undefined>(undefined);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Initialize form data when node changes
  useEffect(() => {
    if (node && node.data) {
      setFormData({
        label: node.data.label || "",
        description: node.data.description || ""
      });
      
      // Initialize exercises if they exist in node data
      if (node.data.exercises) {
        setExercises(node.data.exercises as Exercise[]);
      }
    }
  }, [node]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...formData, exercises });
  };

  const handleDeleteClick = () => {
    if (isConfirmingDelete) {
      onDelete();
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleAddExerciseClick = () => {
    setCurrentExercise(undefined); // Reset to empty for new exercise
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (id: string) => {
    const exercise = exercises.find(ex => ex.id === id);
    if (exercise) {
      setCurrentExercise(exercise);
      setIsExerciseModalOpen(true);
    }
  };

  const handleSaveExercise = (exercise: Exercise) => {
    const isEditing = exercises.some(ex => ex.id === exercise.id);
    
    if (isEditing) {
      // Update existing exercise
      setExercises(exercises.map(ex => 
        ex.id === exercise.id ? exercise : ex
      ));
    } else {
      // Add new exercise
      setExercises([...exercises, { 
        ...exercise,
        order_index: exercises.length
      }]);
    }
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
          onClick={onClose}
        ></div>
        
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <Header 
                nodeLabel={node.data?.label} 
                onClose={onClose}
              />
              
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Left column */}
                  <div className="lg:col-span-1 space-y-6">
                    <NodeInfoForm
                      label={formData.label}
                      description={formData.description}
                      onInputChange={handleInputChange}
                    />
                    
                    <NodeMetadata node={node} />
                  </div>
                  
                  {/* Right column - Exercises */}
                  <div className="lg:col-span-1 space-y-6">
                    <ExerciseList
                      exercises={exercises}
                      onEditExercise={handleEditExercise}
                      onDeleteExercise={handleDeleteExercise}
                      handleAddExerciseClick={handleAddExerciseClick}
                    />
                  </div>
                </div>
              </div>
              
              <Footer
                isConfirmingDelete={isConfirmingDelete}
                onDeleteClick={handleDeleteClick}
                onCancelDelete={handleCancelDelete}
                onClose={onClose}
              />
            </form>
          </div>
        </div>
      </div>
      
      {/* Exercise Editor Modal */}
      <ExerciseEditorModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSave={handleSaveExercise}
        exercise={currentExercise}
        nodeId={node.id}
      />
    </>
  );
};

export default NodeEditor;
