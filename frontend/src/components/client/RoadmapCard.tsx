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
      <div className="w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow">
        <div className="w-52 h-40 bg-sky-300 rounded-2xl" />
        <div className="w-full">
          <p className="font-extrabold">{roadmap.title}</p>
          <p className="text-sm text-neutral-400">{roadmap.description}</p>
        </div>
        <div className="w-full mt-2">
          <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-neutral-400">{progress}% complete</p>
        </div>
        <button className="bg-sky-700 font-extrabold p-2 px-6 rounded-xl hover:bg-sky-500 transition-colors">
          Dkhel lcours
        </button>
      </div>
    );
  };
  
  export default RoadmapCard;
  