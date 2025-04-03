'use client';
import { useState, useEffect } from 'react';
import { getSubjects } from '../lib/api';
import Link from 'next/link';

export default function HomePage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const data = await getSubjects();
        setSubjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchSubjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to KaTuripu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.subjectId}`} key={subject.subjectId}>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-2xl font-semibold">{subject.subjectName}</h2>
            </div>
          </Link>
        ))}
      </div>
      
      {subjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl">No subjects available at the moment.</p>
        </div>
      )}
    </div>
  );
}