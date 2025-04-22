import { useTranslations } from 'next-intl';
import React from 'react';

interface HeroProps {
  locale?: string;
}

const Hero = ({ locale = 'en' }: HeroProps) => {
  const t = useTranslations('hero');
  const isRTL = locale === 'ar';

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white to-[#eae6ff] dark:from-gray-900 dark:to-indigo-900/30 pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Content section */}
          <div
            className={`w-full lg:w-1/2 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
          >
            <div className="relative mb-8">
              <span className="absolute -left-2 -top-2 w-16 h-16 bg-[#66c2bc]/60 dark:bg-[#66c2bc]/30 rounded-full blur-2xl opacity-70"></span>
              <span className="absolute -right-10 bottom-0 w-20 h-20 bg-[#ff9d8a]/60 dark:bg-[#ff9d8a]/30 rounded-full blur-2xl opacity-70"></span>

              <h1 className={`relative font-bold ${locale === 'fr' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'} tracking-tight`}>
                <span className="block text-gray-900 dark:text-white">{t('tagline')}</span>
                <span className="block mt-2">
                  <span className="relative">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6b9bd1] to-[#ff9d8a] blur-lg opacity-40"></span>
                    <span className="relative bg-gradient-to-r from-[#4a7ab0] to-[#ff8066] bg-clip-text text-transparent dark:from-[#6b9bd1] dark:to-[#ff9d8a]">
                      {t('highlight1')}
                    </span>
                  </span>
                </span>
              </h1>
            </div>

            <p
              className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8"
            >
              {t('description')}
            </p>

            <div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a
                href="/roadmap"
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] hover:from-[#3d699d] hover:to-[#588ac0] dark:from-[#4a7ab0] dark:to-[#6b9bd1] dark:hover:from-[#3d699d] dark:hover:to-[#588ac0] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:ring-4 focus:ring-[#6b9bd1]/50"
                role="button"
              >
                {t('getStarted')}
              </a>

              <a
                href="#features"
                className="px-8 py-4 text-lg font-bold text-gray-700 dark:text-white bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/70 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {t('learnMore')}
              </a>
            </div>

            <div
              className="mt-8 hidden sm:flex items-center justify-center lg:justify-start space-x-2 text-gray-600 dark:text-gray-400"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800"></div>
                ))}
              </div>
              <span className="text-sm font-medium">Join 2,000+ students</span>
            </div>
          </div>

          {/* Image section */}
          <div
            className="w-full lg:w-1/2 mt-10 lg:mt-0"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -z-10 w-40 h-40 bg-[#66c2bc]/50 dark:bg-[#66c2bc]/30 rounded-full blur-3xl top-1/4 left-1/4 opacity-70"></div>
              <div className="absolute -z-10 w-32 h-32 bg-[#ff9d8a]/50 dark:bg-[#ff9d8a]/30 rounded-full blur-3xl bottom-1/3 right-1/4 opacity-70"></div>

              <img
                src="/images/hero.svg"
                alt="Educational illustration"
                className="w-full max-w-lg mx-auto object-contain drop-shadow-xl dark:filter dark:brightness-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
