"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase';
import * as userService from '@/lib/userService';
import Link from 'next/link';

const Dashboard = () => {
  // State variables
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [completedExercises, setCompletedExercises] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({
    totalExercisesCompleted: 0,
    totalXp: 0,
    completedByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    }
  });

  // Get user session
  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        if (session.user.user_metadata?.full_name) {
          setUsername(session.user.user_metadata.full_name);
        } else {
          setUsername(session.user.email?.split('@')[0] || 'Student');
        }
      } else {
        // Redirect to login if no session
        window.location.href = '/login';
      }
    };

    fetchUserSession();
  }, []);

  // Fetch user progress data when userId is available
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        // Get user progress (XP and completed exercises)
        const progress = await userService.getUserProgress(userId);
        setUserProgress(progress);
        console.log("User progress data:", progress);

        // Get details of completed exercises
        if (progress?.completedExercises && progress.completedExercises.length > 0) {
          const { data: exercises } = await supabase
            .from('exercises')
            .select('*')
            .in('id', progress.completedExercises);
          
          console.log("Completed exercises:", exercises);
          
          if (exercises) {
            setCompletedExercises(exercises);
            
            // Calculate statistics
            const byDifficulty = {
              easy: 0,
              medium: 0,
              hard: 0,
            };
            
            exercises.forEach((exercise) => {
              // Use type guard to ensure difficulty is a valid key
              const difficulty = exercise.difficulty?.toLowerCase() || 'easy';
              // Check if the difficulty is one of our valid keys
              if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
                byDifficulty[difficulty as keyof typeof byDifficulty]++;
              } else {
                // Default to 'easy' if an unknown difficulty is encountered
                byDifficulty.easy++;
              }
            });
            
            setStats({
              totalExercisesCompleted: exercises.length,
              totalXp: progress.xp || 0,
              completedByDifficulty: byDifficulty
            });
          }
        }

        // Get all roadmaps to calculate progress percentages
        const { data: roadmapData } = await supabase
          .from('roadmaps')
          .select('*');
        
        console.log("Roadmap data from database:", roadmapData);
        
        if (roadmapData) {
          setRoadmaps(roadmapData);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Helper function to extract exercises from roadmap data
  const extractExercisesFromRoadmap = (roadmap: any) => {
    // Output variable to store all exercise IDs found
    const exerciseIds: (string | number)[] = [];
    
    try {
      // Case 1: Direct exercises array on roadmap object
      if (roadmap.exercises && Array.isArray(roadmap.exercises)) {
        roadmap.exercises.forEach(ex => {
          if (typeof ex === 'object' && ex.id) {
            exerciseIds.push(ex.id);
          } else if (typeof ex === 'string' || typeof ex === 'number') {
            exerciseIds.push(ex);
          }
        });
      }
      
      // Case 2: exercise_ids array on roadmap object
      if (roadmap.exercise_ids && Array.isArray(roadmap.exercise_ids)) {
        roadmap.exercise_ids.forEach(id => {
          exerciseIds.push(id);
        });
      }
      
      // Case 3: Exercises in data.nodes structure
      let roadmapData;
      if (typeof roadmap.data === 'string') {
        try {
          roadmapData = JSON.parse(roadmap.data);
        } catch (e) {
          // Invalid JSON, skip this approach
          roadmapData = null;
        }
      } else {
        roadmapData = roadmap.data;
      }
      
      if (roadmapData && roadmapData.nodes && Array.isArray(roadmapData.nodes)) {
        roadmapData.nodes.forEach(node => {
          // Process exercises in node
          if (node.exercises && Array.isArray(node.exercises)) {
            node.exercises.forEach(ex => {
              if (typeof ex === 'object' && ex.id) {
                exerciseIds.push(ex.id);
              } else if (typeof ex === 'string' || typeof ex === 'number') {
                exerciseIds.push(ex);
              }
            });
          }
          
          // Process exercise_ids in node
          if (node.exercise_ids && Array.isArray(node.exercise_ids)) {
            node.exercise_ids.forEach(id => {
              exerciseIds.push(id);
            });
          }
        });
      }
      
      // Case 4: Fetch from additional sources if available
      if (roadmap.nodes && Array.isArray(roadmap.nodes)) {
        roadmap.nodes.forEach(node => {
          if (node.exercises) {
            node.exercises.forEach(ex => {
              const id = typeof ex === 'object' ? ex.id : ex;
              exerciseIds.push(id);
            });
          }
        });
      }
      
      // Log what we found for debugging
      console.log(`Found ${exerciseIds.length} exercises for roadmap "${roadmap.title}":`, exerciseIds);
      
      // Return unique exercise IDs
      return [...new Set(exerciseIds)];
      
    } catch (error) {
      console.error(`Error extracting exercises from roadmap ${roadmap.title}:`, error);
      return [];
    }
  };

  // Calculate progress for specific roadmap
  const calculateRoadmapProgress = (roadmap) => {
    if (!roadmap || !userProgress?.completedExercises) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    
    try {
      // Parse roadmap data if it's a string
      let roadmapData;
      if (typeof roadmap.data === 'string') {
        try {
          roadmapData = JSON.parse(roadmap.data);
        } catch (e) {
          console.error(`Error parsing roadmap data for ${roadmap.title}:`, e);
          return { total: 0, completed: 0, percentage: 0 };
        }
      } else {
        roadmapData = roadmap.data;
      }

      // If roadmap data is null or invalid, try to get exercise IDs from other fields
      if (!roadmapData || !roadmapData.nodes) {
        console.log("Roadmap data format doesn't contain nodes, looking for exercises in roadmap.exercises");
        
        // Try to look for exercises directly in the roadmap object
        const exerciseIds = roadmap.exercise_ids || 
                           (roadmap.exercises && roadmap.exercises.map(ex => ex.id)) || 
                           [];
        
        if (exerciseIds.length === 0) {
          return { total: 0, completed: 0, percentage: 0 };
        }
        
        // Count completed exercises from the direct list
        const completedCount = exerciseIds.filter(id => 
          userProgress.completedExercises.includes(id)
        ).length;
        
        const percentage = Math.round((completedCount / exerciseIds.length) * 100);
        
        return {
          total: exerciseIds.length,
          completed: completedCount,
          percentage
        };
      }
      
      // Process nodes structure if available
      let totalExercises = 0;
      let completedCount = 0;

      // Count all exercises in all nodes
      roadmapData.nodes.forEach(node => {
        // Check different possible structures
        const nodeExercises = node.exercises || node.exercise_ids || [];
        
        if (nodeExercises && nodeExercises.length) {
          totalExercises += nodeExercises.length;
          
          // Count completed exercises in this node
          nodeExercises.forEach(exercise => {
            // Handle both objects with IDs and direct ID values
            const exerciseId = typeof exercise === 'object' ? exercise.id : exercise;
            if (userProgress.completedExercises.includes(exerciseId)) {
              completedCount++;
            }
          });
        }
      });

      const percentage = totalExercises > 0 
        ? Math.round((completedCount / totalExercises) * 100) 
        : 0;
        
      return {
        total: totalExercises,
        completed: completedCount,
        percentage
      };
    } catch (error) {
      console.error(`Error calculating roadmap progress for ${roadmap.title}:`, error);
      return { total: 0, completed: 0, percentage: 0 };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <motion.div 
          className="text-xl"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Chargement de votre parcours d'apprentissage...
        </motion.div>
      </div>
    );
  }

  // If no user progress data found
  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl mb-4">Bienvenue dans votre parcours d'apprentissage</h2>
          <p>Commencez à explorer les feuilles de route et à compléter des exercices pour voir votre progression ici.</p>
          <Link href="/roadmap" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
            Explorer les feuilles de route
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mt-8 mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Votre Tableau de Bord d'Apprentissage</h1>
          <p className="text-gray-400">Bonjour {username}, voici le résumé de votre progression</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* XP Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h2 className="text-lg font-medium opacity-80">Points d'Expérience Totaux</h2>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold">{stats.totalXp}</span>
                  <span className="ml-2 text-lg opacity-80">XP</span>
                </div>
              </div>
              <div className="mt-4 text-sm">
                {stats.totalXp >= 500 ? (
                  <span className="text-green-300">Niveau Maître</span>
                ) : stats.totalXp >= 250 ? (
                  <span className="text-blue-300">Niveau Avancé</span>
                ) : stats.totalXp >= 100 ? (
                  <span className="text-yellow-300">Niveau Intermédiaire</span>
                ) : (
                  <span className="text-gray-300">Niveau Débutant</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Completed Exercises Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-br from-purple-600 to-pink-800 rounded-2xl p-6 shadow-lg"
          >
            <div>
              <h2 className="text-lg font-medium opacity-80">Exercices Complétés</h2>
              <div className="mt-2">
                <span className="text-4xl font-bold">{stats.totalExercisesCompleted}</span>
              </div>
              <div className="mt-4 flex space-x-2 text-sm">
                <div className="bg-green-900/40 px-2 py-1 rounded-full">
                  {stats.completedByDifficulty.easy} Facile
                </div>
                <div className="bg-yellow-900/40 px-2 py-1 rounded-full">
                  {stats.completedByDifficulty.medium} Moyen
                </div>
                <div className="bg-red-900/40 px-2 py-1 rounded-full">
                  {stats.completedByDifficulty.hard} Difficile
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Streak Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-br from-orange-600 to-red-800 rounded-2xl p-6 shadow-lg"
          >
            <div>
              <h2 className="text-lg font-medium opacity-80">Activité Récente</h2>
              <div className="mt-2 text-2xl font-bold">
                {completedExercises.length > 0 
                  ? "Apprenant Actif" 
                  : "Commencez Votre Parcours"}
              </div>
              <div className="mt-4 text-sm">
                {completedExercises.length > 0 
                  ? `Dernier complété : ${new Date(completedExercises[0]?.updated_at).toLocaleDateString()}` 
                  : "Aucun exercice complété pour l'instant"}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Roadmap Progress Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Votre Progression sur les Feuilles de Route</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => {
              // Extract all exercises from roadmap using our enhanced helper function
              const roadmapExercises = extractExercisesFromRoadmap(roadmap);
              
              // Calculate completion metrics
              const total = roadmapExercises.length;
              const completed = userProgress?.completedExercises 
                ? roadmapExercises.filter(id => userProgress.completedExercises.includes(id)).length
                : 0;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <motion.div 
                  key={roadmap.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{roadmap.title}</h3>
                    <span className="text-lg font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className={`h-full rounded-full ${
                        percentage >= 75 ? "bg-green-500" :
                        percentage >= 50 ? "bg-blue-500" :
                        percentage >= 25 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                    />
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span>{completed} sur {total} exercices complétés</span>
                    <Link href={`/roadmap/${roadmap.slug}`} className="text-blue-400 hover:text-blue-300 font-medium">
                      Continuer l'apprentissage →
                    </Link>
                  </div>
                </motion.div>
              );
            })}

            {roadmaps.length === 0 && (
              <div className="bg-gray-800 rounded-xl p-6 col-span-2">
                <p>Aucune feuille de route disponible. Revenez bientôt !</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Completed Exercises */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Exercices Récemment Complétés</h2>
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {completedExercises.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {completedExercises.slice(0, 5).map((exercise) => (
                  <motion.div 
                    key={exercise.id}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    className="p-4 md:p-6 flex flex-col md:flex-row justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-lg">{exercise.name}</h3>
                      <p className="text-gray-400 mt-1">
                        {exercise.description?.substring(0, 120) || "Pas de description"}
                        {exercise.description?.length > 120 ? "..." : ""}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exercise.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                        exercise.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {exercise.difficulty === 'easy' ? 'Facile' :
                         exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                      <Link
                        href={`/exercises/${exercise.id}`}
                        className="ml-4 text-blue-400 hover:text-blue-300"
                      >
                        Revoir →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-400">Vous n'avez pas encore complété d'exercices.</p>
                <Link href="/roadmap" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Explorer les feuilles de route et commencer à apprendre →
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;