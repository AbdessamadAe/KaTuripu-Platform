"use client";

import React from 'react';
import { Button } from '@/components/ui';

interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onCancel,
  isSaving,
  primaryLabel = 'Save',
  secondaryLabel = 'Cancel'
}) => {
  return (
    <div className="flex space-x-3">
      <Button 
        onClick={onCancel}
        variant="outline"
        disabled={isSaving}
      >
        {secondaryLabel}
      </Button>
      <Button 
        onClick={onSave}
        variant="primary"
        isLoading={isSaving}
        disabled={isSaving}
      >
        {primaryLabel}
      </Button>
    </div>
  );
};

export default ActionButtons;