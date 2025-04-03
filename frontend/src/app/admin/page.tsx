'use client';
import { useState, useEffect } from 'react';
import { getSubjects, getTopics, createSubject, updateSubject, deleteSubject, createTopic, updateTopic, deleteTopic } from '../../lib/api';
import Link from 'next/link';

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface Topic {
  topicId: number;
  subjectId: number;
  topicTitle: string;
  topicOverview: string;
}

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const subjectsData = await getSubjects();
        const topicsData = await getTopics();
        
        setSubjects(subjectsData);
        setTopics(topicsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handle subject creation
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newSubjectName.trim()) {
        alert('Please enter a subject name');
        return;
      }
      
      const newSubject = await createSubject({ subjectName: newSubjectName });
      setSubjects([...subjects, newSubject[0]]);
      setNewSubjectName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subject');
    }
  };

  // Handle subject update
  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    
    try {
      const updatedSubject = await updateSubject(editingSubject.subjectId, editingSubject);
      setSubjects(subjects.map(subject => 
        subject.subjectId === editingSubject.subjectId ? updatedSubject[0] : subject
      ));
      setEditingSubject(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject');
    }
  };

  // Handle subject deletion
  const handleDeleteSubject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all associated topics.')) {
      return;
    }
    
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(subject => subject.subjectId !== id));
      // Also filter out topics that belong to this subject
      setTopics(topics.filter(topic => topic.subjectId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subject');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full p-8">Loading...</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
          <button 
            className="float-right"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Subjects</h2>
          <Link 
            href="/admin/roadmaps" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Manage Roadmaps
          </Link>
        </div>
        
        {/* Add new subject form */}
        <form onSubmit={handleCreateSubject} className="mb-6 bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <input 
              type="text" 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="New subject name"
              className="flex-grow p-2 border rounded mr-2"
            />
            <button 
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Subject
            </button>
          </div>
        </form>
        
        {/* Edit subject form */}
        {editingSubject && (
          <form onSubmit={handleUpdateSubject} className="mb-6 bg-yellow-50 p-4 rounded shadow border border-yellow-200">
            <h3 className="text-lg font-semibold mb-2">Edit Subject</h3>
            <div className="flex items-center">
              <input 
                type="text" 
                value={editingSubject.subjectName}
                onChange={(e) => setEditingSubject({...editingSubject, subjectName: e.target.value})}
                className="flex-grow p-2 border rounded mr-2"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button 
                type="button"
                onClick={() => setEditingSubject(null)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {/* Subjects list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-4">No subjects available. Add your first subject!</p>
          ) : (
            subjects.map((subject) => (
              <div key={subject.subjectId} className="bg-white shadow rounded p-4">
                <h3 className="font-bold">{subject.subjectName}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {topics.filter(t => t.subjectId === subject.subjectId).length} topic(s)
                </p>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => setEditingSubject(subject)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSubject(subject.subjectId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Topics</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overview
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topics.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No topics available
                  </td>
                </tr>
              ) : (
                topics.map((topic) => {
                  const subjectName = subjects.find(s => s.subjectId === topic.subjectId)?.subjectName || 'Unknown';
                  return (
                    <tr key={topic.topicId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {topic.topicTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subjectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {topic.topicOverview}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                        <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
