import { useState } from "react";
import { AdminRoadmapDetails } from "@/types/adminTypes";

/**
 * Hook for managing roadmap form state
 * @param initialData Optional initial data to populate the form
 */
export function useRoadmapForm(initialData?: Partial<AdminRoadmapDetails>) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    imageUrl: initialData?.imageUrl || ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return {
    formData,
    setFormData,
    handleInputChange
  };
}
