'use client';
import { useState, useEffect } from 'react';
import { getSubjects, getTopics, createSubject, updateSubject, deleteSubject } from '../../../lib/api';

export default function AdminPage() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handle subject creation
  const handleCreateSubject = async (subjectData) => {
    try {
      const newSubject = await createSubject(subjectData);
      setSubjects([...subjects, newSubject[0]]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle subject update
  const handleUpdateSubject = async (id, subjectData) => {
    try {
      const updatedSubject = await updateSubject(id, subjectData);
      setSubjects(subjects.map(subject => 
        subject.subjectId === id ? updatedSubject[0] : subject
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle subject deletion
  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(subject => subject.subjectId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject.subjectId} className="bg-white shadow rounded p-4">
              <h3 className="font-bold">{subject.subjectName}</h3>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button 
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteSubject(subject.subjectId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* You can add similar sections for topics and content */}
    </div>
  );
}
