import React, { useState, useEffect } from "react";

type ExerciseSidebarProps = {
  title: string;
  prerequisites: { label: string; link: string }[];
  problems: { id: string; name: string; difficulty: string; solution?: string; completed?: boolean }[];
  onClose: () => void;
  onProblemToggle?: (id: string, completed: boolean) => void;
};

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-500",
};

const ExerciseSidebar: React.FC<ExerciseSidebarProps> = ({ 
  title, 
  prerequisites, 
  problems, 
  onClose,
  onProblemToggle 
}) => {
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize completed problems from props
  useEffect(() => {
    const initialCompleted: Record<string, boolean> = {};
    problems.forEach(problem => {
      if (problem.completed) {
        initialCompleted[problem.id] = true;
      }
    });
    setCompletedProblems(initialCompleted);
    
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 50);
  }, [problems]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete before closing
  };
  
  const toggleProblem = (id: string) => {
    const newCompletedProblems = { 
      ...completedProblems, 
      [id]: !completedProblems[id] 
    };
    setCompletedProblems(newCompletedProblems);
    
    if (onProblemToggle) {
      onProblemToggle(id, newCompletedProblems[id]);
    }
  };
  
  const completedCount = Object.values(completedProblems).filter(Boolean).length;

  return (
    <div 
      className={`fixed top-0 right-0 w-4/5 h-full bg-gray-900 text-white p-6 shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button */}
      <button onClick={handleClose} className="bg-red-600 px-4 py-2 rounded-md mb-4">ESC</button>

      {/* Title */}
      <h2 className="text-xl font-bold text-center">{title}</h2>
      <p className="text-gray-400 text-center">({completedCount} / {problems.length})</p>

      {/* Prerequisites Section */}
      <div className="bg-gray-800 p-4 rounded-md mt-4">
        <h3 className="text-lg font-semibold">Prerequisites</h3>
        {prerequisites.map((prereq, index) => (
          <a key={index} href={prereq.link} target="_blank" className="text-blue-400 block">
            {prereq.label}
          </a>
        ))}
      </div>

      {/* Problems Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[45%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-2 text-center">Star</th>
              <th className="py-3 px-4 text-left">Problem</th>
              <th className="py-3 px-4 text-center">Difficulty</th>
              <th className="py-3 px-2 text-center">Solution</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="py-2 px-2 text-center">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded cursor-pointer" 
                    checked={!!completedProblems[problem.id]}
                    onChange={() => toggleProblem(problem.id)}
                  />
                </td>
                <td className="py-2 px-2 text-center text-yellow-300">⭐</td>
                <td className="py-2 px-4 truncate">
                  <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">{problem.name}</a>
                </td>
                <td className={`py-2 px-4 text-center ${difficultyColors[problem.difficulty] || "text-white"} font-medium`}>
                  {problem.difficulty}
                </td>
                <td className="py-2 px-2 text-center">
                  {problem.solution ? (
                    <a 
                      href={problem.solution} 
                      target="_blank"
                      className="text-xl hover:text-blue-300 transition-colors duration-200"
                    >
                      📹
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseSidebar;
