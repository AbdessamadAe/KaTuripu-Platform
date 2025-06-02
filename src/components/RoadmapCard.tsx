import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RoadmapMeta } from '@/types/types';
import { Button, Badge } from '@/components/ui';

interface RoadmapCardProps {
  roadmap: RoadmapMeta;
  progress: number;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, progress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('roadmap');

  const getCategories = (): string[] =>
    Array.isArray(roadmap?.roadmap_category)
      ? roadmap?.roadmap_category
      : roadmap?.roadmap_category
        ? [roadmap?.roadmap_category]
        : [];

  const topicsCount = roadmap.total_exercises || 'N/A';
  const difficulty = roadmap?.difficulty || 'Beginner';
  const duration = roadmap?.duration || 'N/A';
  const category = roadmap?.roadmap_category || 'N/A';

  return (
    <div
      className={`transition-all w-[280px] bg-white dark:bg-gray-800/90 rounded-xl overflow-hidden shadow-md ${
        isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative w-full h-[195px] bg-gradient-to-br from-orange-100 to-blue-100 dark:from-orange-900/30 dark:to-blue-900/30">
        {roadmap?.roadmap_image_url && (
          <img
            src="https://app.manara.tech/_next/image?url=https%3A%2F%2Flite-production.s3.us-east-2.amazonaws.com%2Flearning_path_images%2Flp_card_images%2Fp.english.png&w=640&q=75"
            alt={roadmap?.roadmap_title}
            className="w-full h-full object-center object-contain"
          />
        )}
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Learning path & courses count */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>Concours</span>
          <span className="mx-2">•</span>
          <span>{topicsCount} exercises</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm h-11 text-gray-900 dark:text-white mb-4">
          {roadmap?.roadmap_title || "How to Land a Job at a Global Tech Company"}
        </h3>

        {/* Progress bar */}
        <div className="w-full mt-2 mb-4">
          <div className="relative h-2 bg-orange-100 dark:bg-orange-900/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-orange-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category, Difficulty, Duration */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {category}
          </span>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-4">
                <svg viewBox="0 0 24 24" fill="none" className="text-green-500">
                  <path d="M12 6V18M4 10V14M20 10V14M16 7V17M8 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-gray-600 dark:text-gray-400">{difficulty}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-gray-600 dark:text-gray-400">{duration} hr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;
