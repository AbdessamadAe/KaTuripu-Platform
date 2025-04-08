"use client";

import { useGamification } from "@/contexts/GamificationContext";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface RoadmapCardProps {
  roadmap: Roadmap;
  progress: number;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, progress }) => {
  const { state } = useGamification();
  
  const isCompleted = state.roadmapsCompleted.includes(roadmap.id);
  const isStarted = state.roadmapsStarted.includes(roadmap.id) || progress > 0;

  return (
    <div className={`w-72 h-80 ${isCompleted ? 'bg-green-50' : 'bg-white'} rounded-3xl text-gray-800 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-50 hover:shadow-2xl ${isCompleted ? 'hover:shadow-green-200' : 'hover:shadow-blue-200'} transition-shadow border ${isCompleted ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="w-64 h-40 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
        <span className="text-4xl">📚</span>
        
        {/* Status badges */}
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
            <span className="mr-1">✓</span> مكتمل
          </div>
        )}
        
        {!isCompleted && isStarted && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
            <span className="mr-1">▶</span> مبدوء
          </div>
        )}
        
        {!isStarted && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
            <span className="mr-1">🆕</span> جديد
          </div>
        )}
      </div>
      <div className="w-full">
        <p className="font-extrabold text-lg">{roadmap.title}</p>
        <p className="text-sm text-gray-600">{roadmap.description}</p>
      </div>
      <div className="w-full mt-2">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-blue-400'} transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-gray-500">{progress}% تم إكماله</p>
      </div>
      <button className={`${isCompleted ? 'bg-green-500 hover:bg-green-400' : 'bg-blue-500 hover:bg-blue-400'} text-white font-extrabold p-2 px-6 rounded-xl transition-colors w-full text-center`}>
        {isCompleted ? 'مراجعة الخريطة' : (isStarted ? 'متابعة التقدم' : 'بدء الخريطة')}
      </button>
    </div>
  );
};

export default RoadmapCard;
  