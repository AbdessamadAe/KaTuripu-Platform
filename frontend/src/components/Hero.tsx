import { useTranslations } from 'next-intl';

interface HeroProps {
  locale?: string;
}

const Hero = ({ locale = 'en' }: HeroProps) => {
  const t = useTranslations('hero');
  const isRTL = locale === 'ar';
  return (
    <div className={`w-full mt-8 px-auto flex items-center min-h-[80vh]`}>
      <div className='flex flex-col lg:flex-row items-center md:mx-24 mr-0 px-4 sm:px-6 lg:px-2 relative w-full'>
        <div className="w-full lg:w-7/12 flex items-center">
          <div className={`w-full mx-auto mb-0 lg:mx-0`}>
            <p className={`md:text-${isRTL ? 'right' : 'left'} text-center mb-5 text-3xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight`}>
            <span className='flex flex-col md:flex-row md:gap-4'>
            <span className={`relative dark:text-white block mt-2 w-fit mx-auto lg:mx-0 ${isRTL ? 'md:mr-0 md:ml-auto' : ''}`}>
              {t('tagline')}
              </span>
              </span>
              <span className='flex flex-col md:flex-row md:gap-4'>
                <span className={`relative block mt-2 w-fit mx-auto lg:mx-0 ${isRTL ? 'md:mr-0 md:ml-auto' : ''}`}>
                  <span className="bg-gradient-to-r from-sky-400 to-sky-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                  <span className="relative text-sky-600 dark:text-sky-400">{t('highlight1')}</span>
                </span>
              </span>
            </p>

            <h1 className={`lg:text-${isRTL ? 'right' : 'left'} text-center px-0 text-md text-black dark:text-gray-200 font-inter md:text-start mt-4 mb-6 `}>
              {t('description')}
            </h1>

            <div className={`flex flex-row sm:flex-row gap-4 justify-center lg:justify-start mt-9`}>
              <a
                href="/roadmap"
                className="inline-flex items-center justify-center px-2 py-2 md:px-8 md:py-3 md:text-lg font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600 focus:ring-4 focus:ring-sky-500/50 dark:focus:ring-sky-400/50"
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
            className="lg:w-[500px] lg:h-[500px] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] object-contain dark:filter dark:brightness-90"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
