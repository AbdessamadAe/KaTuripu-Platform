import React, { useState, useEffect } from "react";
import { Exercise } from "@/types/types";

// Import sub-components
import Header from "./Header";
import BasicInfoForm from "./BasicInfoForm";
import HintsSection from "./HintsSection";
import ContentForm from "./ContentForm";
import Footer from "./Footer";

interface ExerciseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise?: Partial<Exercise>;
  nodeId: string;
}

const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exercise,
  nodeId
}) => {
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: "",
    difficulty: "medium",
    type: "quiz",
    description: "",
    hints: [],
    completed: false
  });

  const [hint, setHint] = useState("");
  const isEditing = !!exercise?.id;

  // Initialize form when exercise changes
  useEffect(() => {
    if (exercise) {
      setFormData({
        ...exercise,
        hints: exercise.hints || []
      });
    } else {
      // Reset form for new exercise
      setFormData({
        name: "",
        difficulty: "medium",
        type: "quiz",
        description: "",
        hints: [],
        completed: false
      });
    }
  }, [exercise]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddHint = () => {
    if (hint.trim()) {
      setFormData(prev => ({
        ...prev,
        hints: [...(prev.hints || []), hint.trim()]
      }));
      setHint("");
    }
  };

  const handleRemoveHint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hints: (prev.hints || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExercise: Exercise = {
      ...formData,
      id: exercise?.id || `exercise-${Date.now()}`,
      completed: false,
      order_index: exercise?.order_index ?? 0
    } as Exercise;
    
    onSave(newExercise);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <Header isEditing={isEditing} onClose={onClose} />
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left column */}
                <div className="lg:col-span-1 space-y-6">
                  <BasicInfoForm 
                    formData={formData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                  />
                  
                  {/* Hints section */}
                  <HintsSection
                    hints={formData.hints || []}
                    hint={hint}
                    setHint={setHint}
                    handleAddHint={handleAddHint}
                    handleRemoveHint={handleRemoveHint}
                  />
                </div>
                
                {/* Right column */}
                <div className="lg:col-span-1 space-y-6">
                  <ContentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <Footer isEditing={isEditing} onClose={onClose} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseEditorModal;
