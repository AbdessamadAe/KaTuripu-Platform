"use client";
import React, { useState } from 'react';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import AnswerGrid from '@/components/quiz/AnswerGrid';
import FeedbackIndicator from '@/components/quiz/FeedbackIndicator';
import ContinueButton from '@/components/quiz/ContinueButton';
import { Quiz, Question } from '@/components/quiz/types';
import QuizHeader from '@/components/quiz/QuizHeader';


// Mock Data
const mockQuiz: Quiz = {
    id: 'quiz1',
    title: 'Math Quiz',
    questions: [
        {
            id: 'q1',
            text: "What's $$\sum_{}^{}?$$",
            answers: [
                { id: 'a1', text: '4', isCorrect: false },
                { id: 'a2', text: '8', isCorrect: true },
                { id: 'a3', text: '10', isCorrect: false },
                { id: 'a4', text: '16', isCorrect: false },
            ],
            correctAnswerId: 'a2',
        },
        {
            id: 'q2',
            text: 'What is 2 + 2?',
            answers: [
                { id: 'b1', text: '3', isCorrect: false },
                { id: 'b2', text: '4', isCorrect: true },
                { id: 'b3', text: '5', isCorrect: false },
                { id: 'b4', text: '6', isCorrect: false },
            ],
            correctAnswerId: 'b2',
        },
    ],
};

const QuizPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | undefined>(undefined);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];

    const handleAnswerClick = (answerId: string) => {
        if (showFeedback) return;

        setSelectedAnswerId(answerId);
        const correctAnswer = currentQuestion.correctAnswerId === answerId;
        setIsAnswerCorrect(correctAnswer);
        setShowFeedback(true);
    };

    const handleContinue = () => {
        setShowFeedback(false);
        setSelectedAnswerId(undefined);
        if (currentQuestionIndex < mockQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz finished, handle completion (e.g., show results page)
            alert('Quiz Finished!');
            setCurrentQuestionIndex(0); // Reset for now
        }
    };

    const handleWhyClick = () => {
        // Implement "Why?" functionality - e.g., show an explanation modal
        alert('Explanation for this question would appear here.');
    };

    if (!currentQuestion) {
        return <div>Loading quiz...</div>; // Or some other loading state
    }

    return (
        <div className="min-h-screen bg-white    flex flex-col items-center">
            <QuizHeader 
                currentQuestionIndex={currentQuestionIndex + 1}
                totalQuestions={mockQuiz.questions.length}
            />
            <div className="flex justify-center w-full max-w-4xl mx-auto px-4 py-8">
                <div className="p-8 w-full">
                    <div className="bg-gray-50 p-6 rounded-t-xl shadow-inner">
                        <QuestionDisplay
                            questionText={currentQuestion.text}
                        />
                        <AnswerGrid
                            answers={currentQuestion.answers}
                            selectedAnswerId={selectedAnswerId}
                            correctAnswerId={currentQuestion.correctAnswerId}
                            onAnswerClick={handleAnswerClick}
                            showResult={showFeedback}
                        />
                    </div>
                    <FeedbackIndicator show={showFeedback} isCorrect={isAnswerCorrect} />
                    <ContinueButton
                        onClick={handleContinue}
                        onWhyClick={handleWhyClick}
                        disabled={!showFeedback}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuizPage;

