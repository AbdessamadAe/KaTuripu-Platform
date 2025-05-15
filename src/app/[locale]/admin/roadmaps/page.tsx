"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import ErrorMessage from '@/components/Error';
import { useAdminRoadmaps } from '@/hooks/useAdminRoadmaps';
import PageHeader from '@/components/admin/PageHeader';
import SearchBar from '@/components/admin/SearchBar';
import RoadmapTable from '@/components/admin/RoadmapTable';
import EmptyState from '@/components/admin/EmptyState';

export default function AdminRoadmaps() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: roadmaps, isLoading, isError } = useAdminRoadmaps();
  
  // Filter roadmaps based on search term
  const filteredRoadmaps = roadmaps?.filter(
    roadmap => roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               roadmap.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleCreateNewRoadmap = () => {
    router.push(`/admin/roadmaps/edit/new`);
  };

  const handleEditRoadmap = (id: string) => {
    router.push(`/admin/roadmaps/edit/${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Roadmaps', href: '/admin/roadmaps' }
            ]} 
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <PageHeader 
            title="Roadmaps Management" 
          />
          
          <button 
            onClick={handleCreateNewRoadmap}
            className="px-4 py-2 bg-[#5a8aaf] hover:bg-[#4a7ab0] text-white rounded-lg shadow transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {/* Roadmaps list */}
        {filteredRoadmaps.length === 0 ? (
          <EmptyState
            title="No roadmaps found"
            description="Try adjusting your search or create a new roadmap"
            action={
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear search
              </button>
            }
          />
        ) : (
          <RoadmapTable
            roadmaps={filteredRoadmaps}
            onEdit={handleEditRoadmap}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
}