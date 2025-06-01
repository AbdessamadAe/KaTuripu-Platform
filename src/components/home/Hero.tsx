import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '@/components/ui';

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
    <div className="w-full min-h-[90vh] flex items-center overflow-hidden pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Content section */}
          <div
            className={`w-full lg:w-1/2 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
          >
            <div className="relative mb-8">
              <span className="absolute -left-2 -top-2 w-16 h-16 bg-[var(--secondary-color)]/60 dark:bg-[var(--secondary-color)]/30 rounded-full blur-2xl opacity-70"></span>
              <span className="absolute -right-10 bottom-0 w-20 h-20 bg-[var(--primary-color)]/60 dark:bg-[var(--primary-color)]/30 rounded-full blur-2xl opacity-70"></span>

              <h1 className={`relative font-bold ${locale === 'fr' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'} tracking-tight`}>
                <span className="block text-gray-900 dark:text-white">{t('tagline')}</span>
                <span className="block mt-2">
                  <span className="relative">
                    <span className="absolute dark:hidden inset-0 w-full h-full bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)] blur-lg opacity-40"></span>
                    <span className="relative bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent dark:from-[var(--secondary-color)] dark:to-[var(--primary-color)]">
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
              <Button
                href="/roadmap"
                size="lg"
                variant="primary"
              >
                {t('getStarted')}
              </Button>

              <Button
                href="#features"
                size="lg"
                variant="outline"
              >
                {t('learnMore')}
              </Button>
            </div>

            <div
              className="mt-8 hidden sm:flex items-center justify-center lg:justify-start space-x-2 text-gray-600 dark:text-gray-400"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800">
                    <img
                      src={`/images/testimonials/student${i}.jpg`}
                      alt={`Student ${i}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
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
              <div className="absolute -z-10 w-40 h-40 bg-[var(--secondary-color)]/50 dark:bg-[var(--secondary-color)]/30 rounded-full blur-3xl top-1/4 left-1/4 opacity-70"></div>
              <div className="absolute -z-10 w-32 h-32 bg-[var(--primary-color)]/50 dark:bg-[var(--primary-color)]/30 rounded-full blur-3xl bottom-1/3 right-1/4 opacity-70"></div>

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
