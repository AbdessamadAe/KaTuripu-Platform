import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface QuizHeaderProps {
  roadmapTitle?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ 
  roadmapTitle
}) => {
    const router = useRouter();
    const { roadmapId } = useParams<{ roadmapId: string }>();
    
    return (
        <div className="border-b w-full flex items-center justify-between px-4 h-20 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <button 
                onClick={() => router.push(`/roadmap/${roadmapId}`)} 
                className="text-2xl px-4 font-bold hover:text-gray-600"
                aria-label="Close quiz"
            >
                &times;
            </button>
            <div className="text-center flex flex-row items-center justify-center">
                {roadmapTitle && <p className="text-xl text-gray-500">{roadmapTitle}</p>}
            </div>
            <div className="w-8"></div> {/* Spacer for visual balance */}
        </div>
    )
}

export default QuizHeader;