import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  AcademicCapIcon, 
  MapIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  PuzzlePieceIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#c5b3ff]/60 dark:border-gray-700/50 relative overflow-hidden transform hover:-translate-y-1">
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#66c2bc]/40 dark:bg-[#66c2bc]/20 rounded-full blur-xl"></div>
      <div className="absolute -left-6 -top-6 w-16 h-16 bg-[#ff9d8a]/40 dark:bg-[#ff9d8a]/20 rounded-full blur-xl"></div>
      
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#4a7ab0] to-[#6b9bd1] dark:from-[#4a7ab0] dark:to-[#6b9bd1] rounded-xl flex items-center justify-center text-white shadow-md">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center sm:text-left">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center sm:text-left leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface FeaturesProps {
  id?: string;
  locale?: string;
}

const Features: React.FC<FeaturesProps> = ({ id = "features", locale = 'en' }) => {
  const t = useTranslations('features');
  const isRTL = locale === 'ar';
  
  const featuresList = [
    {
      icon: <MapIcon className="w-6 h-6" />,
      title: t('roadmaps.title'),
      description: t('roadmaps.description')
    },
    {
      icon: <PuzzlePieceIcon className="w-6 h-6" />,
      title: t('exercises.title'),
      description: t('exercises.description')
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: t('progress.title'),
      description: t('progress.description')
    },
    {
      icon: <DocumentCheckIcon className="w-6 h-6" />,
      title: t('achievements.title'),
      description: t('achievements.description')
    },
    {
      icon: <AcademicCapIcon className="w-6 h-6" />,
      title: t('learning.title'),
      description: t('learning.description')
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: t('community.title'),
      description: t('community.description')
    }
  ];

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-[#eae6ff] to-white dark:from-indigo-900/30 dark:to-gray-900 overflow-hidden relative">
      {/* Background decorative elements to match Hero */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#66c2bc]/40 dark:bg-[#66c2bc]/20 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#ff9d8a]/30 dark:bg-[#ff9d8a]/20 rounded-full blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ${isRTL ? 'lg:text-right' : ''}`}>   
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            {t('heading')}
          </h2>
          <p className="max-w-3xl mx-auto lg:mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t('subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featuresList.map((feature, index) => (
            <FeatureItem 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <a 
          href="/roadmap" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] hover:from-[#3d699d] hover:to-[#588ac0] dark:from-[#4a7ab0] dark:to-[#6b9bd1] dark:hover:from-[#3d699d] dark:hover:to-[#588ac0] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {t('exploreButton')}
        </a>
      </div>
    </section>
  );
};

export default Features;
