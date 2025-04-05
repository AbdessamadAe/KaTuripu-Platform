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
    <div className="w-full h-screen flex flex-col-reverse sm:flex-row items-center justify-center sm:pt-[50px] space-x-0 sm:space-x-[100px]">
      <div className="mb-16 sm:m-auto w-1/2">
        <img
          src="/images/problem-solving.svg"
          alt="illustration"
          className="sm:w-[500px] sm:h-[500px] w-[80%] mx-auto"
        />
      </div>
      <div className="flex flex-col w-1/2 text-center items-center font-amiri">
        <h1
          className="pb-8 sm:pb-12 font-bold"
          style={{ fontSize: 'var(--fs-h1)' }}
        >
          إكتشف. تعلم. إستمتع
        </h1>

        <div
          className="pb-8 font-bold leading-10"
          style={{ fontSize: 'var(--fs-h5)' }}
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
          className="bg-[#7C3AED] hover:bg-[var(--primary-color)] active:bg-violet-700 text-white py-2 px-10 rounded-full focus:outline-none focus:ring focus:ring-violet-300"
        >
          إقرأ المزيد
        </button>
      </div>
    </div>
  );
};

export default Hero;
