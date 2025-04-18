"use client";

import React, { useEffect, useState } from "react";
import { RoadmapData } from "@/types/types";
import Roadmap from "@/components/client/RoadmapViewer";
import { motion, AnimatePresence } from "framer-motion";

interface ClientRoadmapWrapperProps {
  roadmapData: RoadmapData;
}

export default function ClientRoadmapWrapper({ roadmapData }: ClientRoadmapWrapperProps) {
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    // Always show introduction on load (no caching)
    setShowIntroduction(false);

    const timer = setTimeout(() => {
      setShowRoadmap(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissIntro = () => {
    setShowIntroduction(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntroduction && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                Bienvenue sur KaTuripu !
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Comment utiliser les parcours d'apprentissage ?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Les parcours d'apprentissage sont des chemins structurés qui vous guident à travers
                    des concepts clés. Suivez le flux des nœuds de gauche à droite pour progresser logiquement.
                  </p>
                </div>

                <div className="flex items-start space-x-3 border-l-4 border-green-500 pl-3">
                  <div>
                    <strong className="block">1. Cliquez sur un nœud</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Chaque nœud contient des exercices sur un concept spécifique.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border-l-4 border-blue-500 pl-3">
                  <div>
                    <strong className="block">2. Complétez les exercices</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Résoudre des exercices vous fait gagner des points XP et marque votre progression.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border-l-4 border-purple-500 pl-3">
                  <div>
                    <strong className="block">3. Suivez votre progression</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      La barre de progression de chaque nœud se remplit à mesure que vous complétez les exercices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={handleDismissIntro}
                  className="text-gray-500 dark:text-gray-400 underline text-sm"
                >
                  Ne plus afficher
                </button>
                <button 
                  onClick={handleDismissIntro}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Commencer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showRoadmap ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Roadmap roadmapData={roadmapData} />
      </motion.div>
    </>
  );
}
