"use client";

import { useState, useEffect } from 'react';
import Nav from '@/components/client/Nav';
import UserProfile from '@/components/gamification/UserProfile';
import { getAllRoadmaps } from '@/lib/api';
import Link from 'next/link';
import { useGamification } from '@/contexts/GamificationContext';

const DashboardPage = () => {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<{ [slug: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const { state } = useGamification();

  useEffect(() => {
    async function loadData() {
      const data = await getAllRoadmaps();
      setRoadmaps(data);

      const savedProgress = JSON.parse(localStorage.getItem("roadmapProgress") || "{}");

      const progressPerRoadmap: { [slug: string]: number } = {};

      data.forEach((roadmap: any) => {
        let completed = 0;
        let total = 0;

        roadmap.nodes.forEach((node: any) => {
          node.exercises.forEach((ex: any) => {
            total++;
            if (savedProgress[node.id]?.[ex.id]) completed++;
          });
        });

        progressPerRoadmap[roadmap.slug] = total === 0 ? 0 : Math.round((completed / total) * 100);
      });

      setProgressMap(progressPerRoadmap);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  // Calculate overall stats
  const totalExercises = Object.keys(state.exercisesCompleted).length;
  const completedRoadmaps = state.roadmapsCompleted.length;
  const currentLevel = state.level;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">لوحة التحكم الشخصية</h1>
            <p className="text-gray-600 text-lg">تتبع تقدمك وإنجازاتك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <UserProfile />
            </div>

            {/* Roadmaps and Stats */}
            <div className="lg:col-span-2">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{totalExercises}</div>
                  <div className="text-gray-500">تمارين مكتملة</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{completedRoadmaps}</div>
                  <div className="text-gray-500">خرائط مكتملة</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{currentLevel}</div>
                  <div className="text-gray-500">المستوى الحالي</div>
                </div>
              </div>

              {/* Recent Roadmaps */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">الخرائط</h2>
                </div>
                <div className="p-6">
                  {roadmaps.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">لا توجد خرائط متاحة</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {roadmaps.map((roadmap) => (
                        <Link href={`/roadmaps/${roadmap.slug}`} key={roadmap.id} className="block">
                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{roadmap.title}</h3>
                              <div className="flex items-center">
                                {state.roadmapsCompleted.includes(roadmap.id) ? (
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    مكتمل
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">{progressMap[roadmap.slug] || 0}% مكتمل</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${state.roadmapsCompleted.includes(roadmap.id) ? 'bg-green-500' : 'bg-blue-500'}`}
                                  style={{ width: `${progressMap[roadmap.slug] || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 