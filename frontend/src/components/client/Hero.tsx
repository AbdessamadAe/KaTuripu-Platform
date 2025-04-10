'use client';
import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const texts: string[] = ['الرياضيات', 'الخوارزميات', 'علوم الحاسوب'];
  const [animationIndex, setAnimationIndex] = useState<number>(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setAnimationIndex((current) => (current + 1) % texts.length);
    }, 3000);
    return () => clearInterval(intervalID);
  }, [texts.length]);

  return (
    <div className="w-full mt-24 md:mt-0 flex flex-col-reverse lg:flex-row items-center justify-center lg:pt-[50px] space-x-0 lg:space-x-[100px] px-4 sm:px-6 lg:px-8">
      <div className="mb-8 lg:mb-0 lg:m-auto w-full lg:w-1/2 flex justify-center">
        <img
          src="/images/problem-solving.svg"
          alt="illustration"
          className="lg:w-[500px] lg:h-[500px] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] object-contain"
        />
      </div>
      <div className="flex flex-col w-full lg:w-1/2 text-center items-center font-amiri space-y-6 lg:space-y-8">
        <h1
          className="pb-4 lg:pb-12 font-bold text-4xl sm:text-5xl lg:text-6xl"
        >
          إكتشف. تعلم. إستمتع
        </h1>

        <div
          className="pb-4 lg:pb-8 font-bold leading-8 sm:leading-10 text-xl sm:text-2xl lg:text-3xl"
        >
          أول منصة مغاربية لتعلم{' '}
          {texts.map((text, i) => (
            <div key={i} className={i === animationIndex ? 'fadeInSlide' : 'hidden'}>
              {text}
            </div>
          ))}
        </div>

        <button
          onClick={() => (window.location.href = '#mission')}
          className="bg-[#7C3AED] hover:bg-[var(--primary-color)] active:bg-violet-700 text-white py-2 px-8 sm:px-10 rounded-full focus:outline-none focus:ring focus:ring-violet-300 text-base sm:text-lg transition-colors duration-200"
        >
          إقرأ المزيد
        </button>
      </div>
    </div>
  );
};

export default Hero;
