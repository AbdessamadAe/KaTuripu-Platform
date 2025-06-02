"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import AnswerGrid from '@/components/quiz/AnswerGrid';
import FeedbackIndicator from '@/components/quiz/FeedbackIndicator';
import ContinueButton from '@/components/quiz/ContinueButton';
import { Quiz, Question } from '@/components/quiz/types';
import QuizHeader from '@/components/quiz/QuizHeader';
import { useQuizByRoadmap, useSubmitQuizResult } from '@/hooks';
import { QuizWithQuestions } from '@/services/quizService';
import  Modal, { ModalActions } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { showAchievement, fireConfetti } from '@/utils/utils';

const QuizPage: React.FC = () => {
    const router = useRouter();
    const { roadmapId } = useParams<{ roadmapId: string }>();
    const { user } = useUser();
    
    const { data: quiz, isLoading, error } = useQuizByRoadmap(roadmapId as string);
    const { mutate: submitQuizResult, isLoading: isSubmitting } = useSubmitQuizResult();
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Initialize/reset quiz state when quiz data is loaded
    useEffect(() => {
        if (quiz) {
            setCurrentQuestionIndex(0);
            setSelectedAnswerIndex(null);
            setShowFeedback(false);
            setIsAnswerCorrect(false);
            setScore(0);
            setShowResults(false);
        }
    }, [quiz]);

    const currentQuestion = quiz?.questions[currentQuestionIndex]?.exercise;

    const handleAnswerClick = (index: number) => {
        if (showFeedback) return;

        setSelectedAnswerIndex(index);
        const correctAnswer = currentQuestion?.correctAnswer === index;
        setIsAnswerCorrect(correctAnswer);
        setShowFeedback(true);
        
        // Update score if answer is correct
        if (correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleContinue = () => {
        setShowFeedback(false);
        setSelectedAnswerIndex(null);
        
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz finished, submit result
            if (quiz && user) {
                submitQuizResult({
                    userId: user.id,
                    quizId: quiz.id,
                    score: score
                });
                // Show results modal
                setShowResults(true);
                
                // Show confetti animation for scores over 50%
                const percentage = (score / quiz.questions.length) * 100;
                if (percentage >= 50) {
                    fireConfetti({
                        particleCount: Math.min(150, Math.floor(percentage * 2)),
                        spread: 70
                    });
                }
                
                // Show achievement notification for excellent scores
                if (percentage >= 80) {
                    showAchievement(
                        "Quiz Master",
                        `You scored ${score}/${quiz.questions.length} (${percentage.toFixed(0)}%)!`
                    );
                }
            }
        }
    };

    const handleWhyClick = () => {
        // Show explanation if available
        const explanation = currentQuestion?.explanation;
        if (explanation) {
            alert(explanation);
        } else {
            alert('No explanation available for this question.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading quiz data...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">
            Error loading quiz: {error.message}
        </div>;
    }

    if (!quiz || !currentQuestion) {
        return <div className="flex justify-center items-center min-h-screen">No quiz available for this roadmap.</div>;
    }
    
    // Generate an answers array for the AnswerGrid component
    const answers = currentQuestion.choices.map((choice, index) => ({
        id: index.toString(),
        text: choice,
        isCorrect: index === currentQuestion.correctAnswer
    }));

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            <QuizHeader 
                roadmapTitle={quiz.roadmap?.title}
            />
            <div className="flex justify-center w-full max-w-4xl mx-auto px-4 py-8">
                <div className="p-8 w-full">
                    <div className="bg-gray-50 p-6 rounded-t-xl shadow-inner">
                        <QuestionDisplay
                            questionText={currentQuestion.name}
                            imageUrl={currentQuestion.questionImageUrl}
                        />
                        <AnswerGrid
                            answers={answers}
                            selectedAnswerId={selectedAnswerIndex !== null ? selectedAnswerIndex.toString() : undefined}
                            correctAnswerId={currentQuestion.correctAnswer.toString()}
                            onAnswerClick={(answerId) => handleAnswerClick(parseInt(answerId))}
                            showResult={showFeedback}
                        />
                    </div>
                    <FeedbackIndicator 
                        show={showFeedback} 
                        isCorrect={isAnswerCorrect}
                        hint={showFeedback && !isAnswerCorrect ? currentQuestion.hints?.[0] : undefined}
                    />
                    <ContinueButton
                        onClick={handleContinue}
                        onWhyClick={handleWhyClick}
                        disabled={!showFeedback}
                        isSubmitting={isSubmitting && currentQuestionIndex === quiz.questions.length - 1}
                        isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
                    />
                </div>
            </div>
            <div className="w-full max-w-4xl mx-auto px-4 pb-8">
                <ProgressBar 
                    currentStep={currentQuestionIndex+1} 
                    totalSteps={quiz.questions.length}
                    score={score}
                />
            </div>
            
            {/* Results Modal */}
            {quiz && (
                <Modal
                    isOpen={showResults}
                    onClose={() => router.push(`/roadmap/${roadmapId}`)}
                    title="Quiz Results"
                    size="md"
                >
                    <div className="flex flex-col items-center py-6">
                        <div className="text-6xl mb-4">
                            {(score / quiz.questions.length) >= 0.8 ? '🏆' : 
                             (score / quiz.questions.length) >= 0.5 ? '🎉' : '🤔'}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            You scored {score}/{quiz.questions.length}
                        </h3>
                        <p className="text-lg mb-6 text-gray-600">
                            {(score / quiz.questions.length) >= 0.8 ? 'Excellent job!' : 
                             (score / quiz.questions.length) >= 0.5 ? 'Good work!' : 
                             'Keep practicing!'}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
                            <div 
                                className={`h-4 rounded-full ${
                                    (score / quiz.questions.length) >= 0.8 ? 'bg-green-500' : 
                                    (score / quiz.questions.length) >= 0.5 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${(score / quiz.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <ModalActions>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                // Reset quiz state and start over
                                setCurrentQuestionIndex(0);
                                setSelectedAnswerIndex(null);
                                setShowFeedback(false);
                                setIsAnswerCorrect(false);
                                setScore(0);
                                setShowResults(false);
                            }}
                        >
                            Try Again
                        </Button>
                        <Button 
                            onClick={() => router.push(`/roadmap/${roadmapId}`)}
                        >
                            Return to Roadmap
                        </Button>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};

export default QuizPage;

