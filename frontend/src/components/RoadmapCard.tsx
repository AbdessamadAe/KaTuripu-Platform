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
        return 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/60 dark:to-blue-800/40';
      case 'physics':
        return 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/60 dark:to-purple-800/40';
      case 'chemistry':
        return 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/40';
      case 'biology':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/60 dark:to-yellow-800/40';
      case 'computer science':
      case 'programming':
        return 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/60 dark:to-indigo-800/40';
      case 'languages':
        return 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/60 dark:to-pink-800/40';
      case 'science':
        return 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/60 dark:to-teal-800/40';
      case 'engineering':
        return 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/40';
      default:
        return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/60 dark:to-slate-700/40';
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
    const base = 'absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm';
    switch (roadmap.level) {
      case 'beginner':
        return <span className={`${base} bg-gradient-to-r from-green-500 to-green-600 text-white`}>{t('beginner')}</span>;
      case 'intermediate':
        return <span className={`${base} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white`}>{t('intermediate')}</span>;
      case 'advanced':
        return <span className={`${base} bg-gradient-to-r from-red-500 to-red-600 text-white`}>{t('advanced')}</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`transition-all w-full h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between gap-3 relative overflow-hidden ${
        isHovered ? 'shadow-xl scale-[1.02] border-transparent' : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements similar to Hero */}
      <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-60"></div>
      <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl opacity-50"></div>
      
      {getLevelBadge()}

      <div
        className={`w-full h-44 ${getCategoryColor()} rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner`}
      >
        {roadmap.thumbnailUrl ? (
          <Image
            src={roadmap.thumbnailUrl}
            alt={roadmap.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-5xl filter drop-shadow-md" role="img" aria-label="icon">
            {getCategoryEmoji()}
          </span>
        )}
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
        <h3 className="font-bold text-base md:text-lg line-clamp-1 text-gray-900 dark:text-white">{roadmap.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{roadmap.description}</p>
      </div>

      <div className="w-full mt-2">
        <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${
              progress === 100
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : progress > 50
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {progress > 0 ? `${progress}% ${t('complete')}` : t('notStarted')}
          </span>
          {progress === 100 && (
            <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
              {t('complete')} ✓
            </span>
          )}
        </div>
      </div>

      <button
        className={`w-full mt-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          isHovered 
            ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg' 
            : 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow hover:shadow-md'
        }`}
      >
        {progress > 0 ? t('continue') : t('start')}
      </button>
    </div>
  );
};

export default RoadmapCard;
