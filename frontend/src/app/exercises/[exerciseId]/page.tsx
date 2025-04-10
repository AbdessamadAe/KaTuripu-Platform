"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { Exercise } from '@/types/types';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { getXPForDifficulty } from '@/utils/xpUtils';
import * as userService from '@/lib/userService';
import { showXpGain, showAchievement } from '@/utils/gamificationUtils';

const ExerciseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [userXp, setUserXp] = useState(0);
  const [hintAnimation, setHintAnimation] = useState(false);
  const [isFirstView, setIsFirstView] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const currentUserId = session.user.id;
        setUserId(currentUserId);
        // Get user data from database
        const progress = await userService.getUserProgress(currentUserId);
        if (progress) {
          setUserXp(progress.xp);
          setCompleted(progress.completedExercises.includes(exerciseId));
        }
      }
    };
    fetchUserData();
  }, [exerciseId]);

  // Mark exercise as completed when solution is viewed
  useEffect(() => {
    const markAsCompleted = async () => {
      if (showSolution && userId && !completed && exercise) {
        try {
          // Calculate XP based on difficulty
          const xpToAdd = getXPForDifficulty(exercise.difficulty);
          // Mark exercise as completed using our service
          const { success, progress } = await userService.completeExercise(
            userId,
            exerciseId,
            xpToAdd
          );
          if (success && progress) {
            setUserXp(progress.xp);
            setCompleted(true);
            
            // Show XP gain notification with animation
            showXpGain(xpToAdd, exercise.difficulty);
            
            // Check for achievements (hardcoded for demo, but could be data-driven)
            if (exercise.difficulty.toLowerCase() === 'hard') {
              setTimeout(() => {
                showAchievement('Math Wizard', 'Solved a hard difficulty problem');
              }, 1500);
            }
            
            console.log(`Exercise marked as completed! +${xpToAdd} XP`);
          }
        } catch (error) {
          console.error("Error updating user progress:", error);
        }
      }
    };
    markAsCompleted();
  }, [showSolution, userId, completed, exerciseId, exercise]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();
        if (error || !data) {
          throw new Error('Exercise not found');
        }
        setExercise(data as Exercise);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [exerciseId]);

  // Animation for when hints are revealed
  const triggerHintAnimation = (hintIndex: number) => {
    setHintAnimation(true);
    setShowHint(hintIndex);
    setTimeout(() => {
      setHintAnimation(false);
    }, 700);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <motion.div 
          className="text-xl"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading exercise...
        </motion.div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-2xl mb-4">Exercise not found</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* User XP display */}
      {userId && (
        <motion.div 
          className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-full shadow-lg"
          initial={isFirstView ? { y: -50, opacity: 0 } : false}
          animate={isFirstView ? { y: 0, opacity: 1 } : false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onAnimationComplete={() => setIsFirstView(false)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold">XP:</span>
            <motion.span
              key={userXp} // This forces animation when XP changes
              className="font-bold text-lg"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.5 }}
            >
              {userXp}
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Exercise content with animations */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <motion.div 
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Exercise header with difficulty badge */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              exercise.difficulty === 'easy' ? 'bg-green-500' :
              exercise.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-red-500'
            }`}>
              {exercise.difficulty}
            </span>
          </div>
          
          {/* Exercise description */}
          <div className="bg-gray-700 p-6 rounded-lg mb-8">
            <MathJax>
              <ReactMarkdown>{exercise.name}</ReactMarkdown>
            </MathJax>
          </div>

          {/* Hints section with animations */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Hints</h2>
              <div className="space-y-3">
                {exercise.hints.map((hint, i) => (
                  <div key={i}>
                    <button
                      onClick={() => triggerHintAnimation(i)}
                      className={`px-4 py-2 rounded-lg ${
                        showHint === i 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } transition-colors`}
                    >
                      {showHint === i ? 'Hide Hint' : `Show Hint ${i + 1}`}
                    </button>
                    
                    {showHint === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: 'auto',
                          scale: hintAnimation ? [1, 1.02, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 p-4 bg-gray-700 rounded-lg"
                      >
                        <MathJax>
                          <ReactMarkdown>{hint}</ReactMarkdown>
                        </MathJax>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution section with animation */}
          {exercise.solution && (
            <div className="mt-8">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className={`px-6 py-3 rounded-lg ${
                  showSolution 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors text-white font-bold`}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
              
              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 p-6 bg-gray-700 rounded-lg border-l-4 border-green-500"
                >
                  <h3 className="text-xl font-bold mb-3 text-green-400">Solution</h3>
                  <MathJax>
                    <ReactMarkdown>{exercise.solution}</ReactMarkdown>
                  </MathJax>
                  
                  {/* "Completed" badge appears when solution is viewed */}
                  {completed && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Completed! ✓
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Video section */}
          {exercise.video_url && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Video Explanation</h2>
              <div className="relative pb-56.25 h-0 overflow-hidden rounded-lg">
                <iframe
                  src={exercise.video_url}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          
          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="mt-8 inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Roadmap
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;