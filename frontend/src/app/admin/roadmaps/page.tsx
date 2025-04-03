"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RoadmapListItem {
  id: string;
  title: string;
}

export default function RoadmapsAdmin() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate fetching roadmaps
    const fetchRoadmaps = async () => {
      try {
        // This would be an API call in production
        // const response = await fetch('/api/admin/roadmaps');
        // const data = await response.json();
        
        // Using static data for demonstration
        const data = [
          { id: "math-sm", title: "BAC Math Sciences Mathématiques" },
          { id: "cs-fundamentals", title: "Computer Science Fundamentals" },
        ];
        
        setRoadmaps(data);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
        <Link 
          href="/admin/roadmaps/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Roadmap
        </Link>
      </div>

      {isLoading ? (
        <p>Loading roadmaps...</p>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/roadmaps/editor/${roadmap.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/roadmaps/${roadmap.id}`} 
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
