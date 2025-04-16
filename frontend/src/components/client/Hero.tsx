'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

interface HeroProps {
  locale?: string;
}

const Hero = ({ locale = 'en' }: HeroProps) => {
  const t = useTranslations('hero');
  return (
    <div className={`w-full mt-12 px-auto flex items-center min-h-[80vh]`}>
      <div className='flex flex-col lg:flex-row items-center md:mx-24 mr-0 px-4 sm:px-6 lg:px-2 relative w-full'>
        <div className="w-full lg:w-7/12 flex items-center">
          <div className="w-full mx-auto mb-0 lg:mx-0 text-center lg:text-left">
            <p className="mb-5 text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {t('tagline')}
              <span className='flex flex-col md:flex-row md:gap-4 justify-center lg:justify-start'>
                <span className="relative block mt-2 w-fit mx-auto lg:mx-0">
                  <span className="bg-gradient-to-r from-sky-400 to-sky-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                  <span className="relative text-sky-600">{t('highlight1')}</span>
                </span>
                <span className="relative md:mt-2 w-fit mx-auto lg:mx-0">
                  <span className="bg-gradient-to-r from-sky-400 to-sky-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                  <span className="relative text-sky-600">{t('highlight2')}</span>
                </span>
              </span>
            </p>

            <h1 className="px-0 text-lg text-black font-inter">
              {t('description')}
            </h1>

            <div className="flex flex-row sm:flex-row gap-4 justify-center lg:justify-start mt-9">
              <a
                href="/roadmap"
                className="inline-flex items-center justify-center px-2 py-2 md:px-8 md:py-3 md:text-lg font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 focus:ring-4 focus:ring-sky-500/50"
                role="button"
              >
                {t('getStarted')}
              </a>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-6/12 lg:mt-0 lg:pl-8 flex justify-center lg:justify-end items-center">
          <img
            src="/images/problem-solving.svg"
            alt="illustration"
            className="lg:w-[500px] lg:h-[500px] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
