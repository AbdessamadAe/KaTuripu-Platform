import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Roadmap {
  title: string;
  description: string;
  slug: string;
  category?: string[] | string;
  thumbnailUrl?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

interface RoadmapCardProps {
  roadmap: Roadmap;
  progress: number;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, progress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('roadmap');

  const getPrimaryCategory = (): string => {
    if (Array.isArray(roadmap.category)) return roadmap.category[0]?.toLowerCase() || '';
    return roadmap.category?.toLowerCase() || '';
  };

  const getCategories = (): string[] =>
    Array.isArray(roadmap.category)
      ? roadmap.category
      : roadmap.category
      ? [roadmap.category]
      : [];

  const getCategoryColor = () => {
    const category = getPrimaryCategory();
    switch (category) {
      case 'math':
      case 'mathematics':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'physics':
        return 'bg-purple-100 dark:bg-purple-900';
      case 'chemistry':
        return 'bg-green-100 dark:bg-green-900';
      case 'biology':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'computer science':
      case 'programming':
        return 'bg-indigo-100 dark:bg-indigo-900';
      case 'languages':
        return 'bg-pink-100 dark:bg-pink-900';
      case 'science':
        return 'bg-teal-100 dark:bg-teal-900';
      case 'engineering':
        return 'bg-amber-100 dark:bg-amber-900';
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  const getCategoryEmoji = () => {
    const category = getPrimaryCategory();
    switch (category) {
      case 'math':
        return '🧮';
      case 'physics':
        return '⚛️';
      case 'chemistry':
        return '🧪';
      case 'biology':
        return '🧬';
      case 'computer science':
      case 'programming':
        return '💻';
      case 'languages':
        return '🔤';
      case 'science':
        return '🔬';
      case 'engineering':
        return '⚙️';
      default:
        return '📚';
    }
  };

  const getLevelBadge = () => {
    const base = 'absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full';
    switch (roadmap.level) {
      case 'beginner':
        return <span className={`${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>{t('beginner')}</span>;
      case 'intermediate':
        return <span className={`${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}>{t('intermediate')}</span>;
      case 'advanced':
        return <span className={`${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>{t('advanced')}</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`transition-all w-full h-[400px] bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col justify-between gap-3 relative overflow-hidden ${
        isHovered ? 'shadow-xl scale-[1.015]' : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getLevelBadge()}

      <div
        className={`w-full h-44 ${getCategoryColor()} rounded-2xl flex items-center justify-center overflow-hidden relative`}
      >
        {roadmap.thumbnailUrl ? (
          <Image
            src={roadmap.thumbnailUrl}
            alt={roadmap.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-5xl" role="img" aria-label="icon">
            {getCategoryEmoji()}
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
          {getCategories().map((cat, i) => (
            <span
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-md font-medium dark:text-gray-200"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full">
        <h3 className="font-bold text-base md:text-lg line-clamp-1 dark:text-white">{roadmap.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{roadmap.description}</p>
      </div>

      <div className="w-full mt-1">
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${
              progress === 100
                ? 'bg-green-500'
                : progress > 50
                ? 'bg-blue-500'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {progress > 0 ? `${progress}% ${t('complete')}` : t('notStarted')}
          </span>
          {progress === 100 && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-[10px]">
              {t('complete')} ✓
            </span>
          )}
        </div>
      </div>

      <button
        className={`w-full mt-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
          isHovered ? 'bg-blue-400 dark:bg-blue-600' : 'bg-blue-500 dark:bg-blue-700 hover:bg-blue-400 dark:hover:bg-blue-600'
        } text-white`}
      >
        {progress > 0 ? t('continue') : t('start')}
      </button>
    </div>
  );
};

export default RoadmapCard;
