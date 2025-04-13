"use client";

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase';
import * as userService from '@/lib/userService';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  // State variables
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [completedExercises, setCompletedExercises] = useState<any[]>([]);
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

  // // Get user session
  const { user: userData } = useAuth();

  useEffect(() => {
    if (userData) {
      setUserId(userData.user.id);
      setUsername(userData.user.user_metadata?.full_name || userData.email?.split('@')[0] || 'Student');
    } else {
      // Redirect to login if no session
      window.location.href = '/login';
    }
  }
  , [userData]);

  // useEffect(() => {
  //   const fetchUserSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
      
  //     if (session?.user) {
  //       setUserId(session.user.id);
  //       if (session.user.user_metadata?.full_name) {
  //         setUsername(session.user.user_metadata.full_name);
  //       } else {
  //         setUsername(session.user.email?.split('@')[0] || 'Student');
  //       }
  //     } else {
  //       // Redirect to login if no session
  //       window.location.href = '/login';
  //     }
  //   };

  //   fetchUserSession();
  // }, []);

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
            
            exercises.forEach((exercise:any) => {
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
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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