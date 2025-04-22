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
    <div className="w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Content section */}
          <div
            className={`w-full lg:w-1/2 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
          >
            <div className="relative mb-8">
              <span className="absolute -left-2 -top-2 w-16 h-16 bg-[#a7d1cf]/50 dark:bg-[#a7d1cf]/20 rounded-full blur-2xl opacity-60"></span>
              <span className="absolute -right-10 bottom-0 w-20 h-20 bg-[#f0b9ae]/50 dark:bg-[#f0b9ae]/20 rounded-full blur-2xl opacity-60"></span>

              <h1 className={`relative font-bold ${locale === 'fr' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'} tracking-tight`}>
                <span className="block text-gray-900 dark:text-white">{t('tagline')}</span>
                <span className="block mt-2">
                  <span className="relative">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7d9bbf] to-[#f0b9ae] blur-lg opacity-30"></span>
                    <span className="relative bg-gradient-to-r from-[#5a8aaf] to-[#e99888] bg-clip-text text-transparent dark:from-[#7d9bbf] dark:to-[#f0b9ae]">
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
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#5a8aaf] to-[#7d9bbf] hover:from-[#4d7a9d] hover:to-[#6c8bad] dark:from-[#5a8aaf] dark:to-[#7d9bbf] dark:hover:from-[#4d7a9d] dark:hover:to-[#6c8bad] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:ring-4 focus:ring-[#7d9bbf]/50"
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
              <div className="absolute -z-10 w-40 h-40 bg-[#a7d1cf]/40 dark:bg-[#a7d1cf]/20 rounded-full blur-3xl top-1/4 left-1/4 opacity-70"></div>
              <div className="absolute -z-10 w-32 h-32 bg-[#f0b9ae]/40 dark:bg-[#f0b9ae]/20 rounded-full blur-3xl bottom-1/3 right-1/4 opacity-70"></div>

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
