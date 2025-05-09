import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RoadmapMeta } from '@/types/types';

interface RoadmapCard extends RoadmapMeta {
  level?: 'beginner' | 'intermediate' | 'advanced';
}

interface RoadmapCardProps {
  roadmap: RoadmapCard;
  progress: number;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, progress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('roadmap');

  const getPrimaryCategory = (): string => {
    if (Array.isArray(roadmap?.roadmap_category)) return roadmap?.roadmap_category[0]?.toLowerCase() || '';
    return roadmap?.roadmap_category?.toLowerCase() || '';
  };

  const getCategories = (): string[] =>
    Array.isArray(roadmap?.roadmap_category)
      ? roadmap?.roadmap_category
      : roadmap?.roadmap_category
        ? [roadmap?.roadmap_category]
        : [];


  return (
    <div
      className={`transition-all w-full h-[400px] bg-white dark:bg-gray-800/90 rounded-2xl border border-[#c5b3ff]/60 dark:border-gray-700/50 p-5 flex flex-col justify-between gap-3 relative overflow-hidden ${isHovered ? 'shadow-xl scale-[1.02] border-transparent' : 'hover:shadow-lg'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements with vibrant colors */}
      <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-[#66c2bc]/40 dark:bg-[#66c2bc]/20 rounded-full blur-xl opacity-60"></div>
      <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-[#ff9d8a]/40 dark:bg-[#ff9d8a]/20 rounded-full blur-xl opacity-50"></div>

      <div
        className={`w-full h-44 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner`}
      >
        <img
          src={roadmap?.roadmap_image_url}
          alt={roadmap?.roadmap_title}
          className="object-cover"
        />
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
          {getCategories().map((cat, i) => (
            <span
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-[10px] px-2 py-1 rounded-md font-medium text-gray-700 dark:text-gray-200 shadow-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full">
        <h3 className="font-bold text-base md:text-lg line-clamp-1 text-gray-900 dark:text-white">{roadmap?.roadmap_title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{roadmap?.roadmap_description}</p>
      </div>

      <div className="w-full mt-2">
        <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${progress === 100
                ? 'bg-[#4ade80]'
                : progress > 50
                  ? 'bg-gradient-to-r from-[#6b9bd1] to-[#4a7ab0]'
                  : 'bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1]'
              }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {progress > 0 ? `${progress}% ${t('complete')}` : t('notStarted')}
          </span>
          {progress === 100 && (
            <span className="bg-gradient-to-r from-[#66c2bc] to-[#4db6b0] text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
              {t('complete')} ✓
            </span>
          )}
        </div>
      </div>

      <button
        className={`w-full mt-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${isHovered
            ? 'bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] text-white shadow-lg'
            : 'bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] text-white shadow hover:shadow-md'
          }`}
      >
        {progress > 0 ? t('continue') : t('start')}
      </button>
    </div>
  );
};

export default RoadmapCard;
