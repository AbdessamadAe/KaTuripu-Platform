interface Roadmap {
    title: string;
    description: string;
    slug: string;
  }
  
  interface RoadmapCardProps {
    roadmap: Roadmap;
    progress: number;
  }
  
  const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, progress }) => {
    return (
      <div className="w-72 h-80 bg-white rounded-3xl text-gray-800 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-50 hover:shadow-2xl hover:shadow-blue-200 transition-shadow border border-gray-100">
        <div className="w-64 h-40 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
          <span className="text-4xl">📚</span>
        </div>
        <div className="w-full">
          <p className="font-extrabold text-lg">{roadmap.title}</p>
          <p className="text-sm text-gray-600">{roadmap.description}</p>
        </div>
        <div className="w-full mt-2">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-gray-500">{progress}% تم إكماله</p>
        </div>
        <button className="bg-blue-500 text-white font-extrabold p-2 px-6 rounded-xl hover:bg-blue-400 transition-colors w-full text-center">
          بدا الخدمة
        </button>
      </div>
    );
  };
  
  export default RoadmapCard;
  