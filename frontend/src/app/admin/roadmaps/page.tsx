"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllRoadmaps } from "@/lib/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RoadmapListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export default function RoadmapsAdmin() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRoadmaps();
      setRoadmaps(data);
    } catch (err) {
      setError("Failed to load roadmaps. Please try again later.");
      toast.error("Failed to load roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/roadmaps/${id}?roadmapId=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete roadmap');
      }

      toast.success('Roadmap deleted successfully');
      fetchRoadmaps(); // Refresh the list
    } catch (err) {
      console.error('Error deleting roadmap:', err);
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
        <Link 
          href="/admin/roadmaps/editor/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Roadmap
        </Link>
      </div>

      {isLoading ? (
        <p>Loading roadmaps...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          {roadmaps.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No roadmaps available. Create your first roadmap!</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roadmaps.map((roadmap) => (
                  <tr key={roadmap.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {roadmap.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {roadmap.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                      {roadmap.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link 
                        href={`/admin/roadmaps/editor/${roadmap.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link 
                        href={`/roadmaps/${roadmap.slug}`} 
                        target="_blank"
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(roadmap.id, roadmap.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
