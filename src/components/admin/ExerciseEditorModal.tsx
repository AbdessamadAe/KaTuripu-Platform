"use client";

import React from "react";
import { Exercise } from "@/types/types";
import ExerciseEditorModalComponent from "./modals/exerciseEditor";

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
  return (
    <ExerciseEditorModalComponent
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      exercise={exercise}
      nodeId={nodeId}
    />
  );
};

export default ExerciseEditorModal;