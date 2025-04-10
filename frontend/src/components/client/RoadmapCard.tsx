import { useState } from 'react';
import Image from 'next/image';

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
  
  // Get primary category from array or use the string value
  const getPrimaryCategory = (): string => {
    if (Array.isArray(roadmap.category) && roadmap.category.length > 0) {
      return roadmap.category[0].toLowerCase();
    }
    
    if (typeof roadmap.category === 'string') {
      return roadmap.category.toLowerCase();
    }
    
    return '';
  };
  
  // Extract all categories as an array
  const getCategories = (): string[] => {
    if (Array.isArray(roadmap.category)) {
      return roadmap.category;
    }
    
    if (typeof roadmap.category === 'string') {
      return [roadmap.category];
    }
    
    return [];
  };
  
  // Determine background color based on category or default
  const getCategoryColor = () => {
    const category = getPrimaryCategory();
    
    switch (category) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'bg-blue-100';
      case 'physics':
        return 'bg-purple-100';
      case 'chemistry':
        return 'bg-green-100';
      case 'biology':
        return 'bg-yellow-100';
      case 'computer science':
      case 'programming':
        return 'bg-indigo-100';
      case 'languages':
        return 'bg-pink-100';
      case 'science':
        return 'bg-teal-100';
      case 'engineering':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
    }
  };
  
  // Get appropriate emoji/icon based on category
  const getCategoryEmoji = () => {
    const category = getPrimaryCategory();
    
    switch (category) {
      case 'mathematics':
      case 'math':
      case 'maths':
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

  // Format categories for display
  const formatCategories = () => {
    if (Array.isArray(roadmap.category)) {
      return roadmap.category.join(', ');
    }
    return roadmap.category || '';
  };

  // Get badge color based on level
  const getLevelBadge = () => {
    switch (roadmap.level) {
      case 'beginner':
        return (
          <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Débutant
          </span>
        );
      case 'intermediate':
        return (
          <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Intermédiaire
          </span>
        );
      case 'advanced':
        return (
          <span className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Avancé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-full h-96 bg-white rounded-3xl text-gray-800 p-4 flex flex-col items-start justify-between gap-3 transition-all duration-300 border border-gray-100 relative ${
        isHovered ? 'shadow-2xl shadow-blue-200 scale-[1.03] transform' : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getLevelBadge()}
      
      <div className={`w-full h-48 ${getCategoryColor()} rounded-2xl flex items-center justify-center overflow-hidden relative`}>
        {roadmap.thumbnailUrl ? (
          <Image 
            src={roadmap.thumbnailUrl} 
            alt={roadmap.title}
            fill
            className="object-cover" 
          />
        ) : (
          <span className="text-6xl filter drop-shadow-md" role="img" aria-label="Roadmap icon">
            {getCategoryEmoji()}
          </span>
        )}
        
        {/* Display categories as individual tags */}
        {roadmap.category && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
            {getCategories().map((category, index) => (
              <span 
                key={index} 
                className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-full flex-grow">
        <h3 className="font-extrabold text-lg line-clamp-1">{roadmap.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 h-10">{roadmap.description}</p>
      </div>
      
      <div className="w-full mt-2">
        <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              progress > 70 ? 'bg-green-400' : progress > 30 ? 'bg-blue-400' : 'bg-indigo-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {progress > 0 ? `${progress}% terminé` : 'Pas encore commencé'}
          </p>
          {progress === 100 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Terminé ✓
            </span>
          )}
        </div>
      </div>
      
      <button className={`bg-blue-500 text-white font-extrabold p-2 px-6 rounded-xl hover:bg-blue-400 transition-colors w-full text-center ${
        isHovered ? 'bg-blue-400' : ''
      }`}>
        {progress > 0 ? 'Continuer' : 'Commencer'}
      </button>
    </div>
  );
};

export default RoadmapCard;
