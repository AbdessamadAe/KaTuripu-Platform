import React, { useState, useEffect } from 'react'
// import illustration from '../images/problem-solving.svg'

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
    <div>
          <div className='sm:pt-[50px] w-full flex flex-col-reverse sm:flex-row items-center justify-center h-screen space-x-0 sm:space-x-[100px]'>
            <div className='flex flex-col text-center items-center font-amiri'>
              <h1 className=' text-[#1F2937] pb-8 sm:pb-12 font-bold text-4xl sm:text-h1 '>
                إكتشف. تعلم. إستمتع
              </h1>
              <div className='text-primary-color pb-8 sm:pb-8 font-bold text-2xl leading-10 sm:text-h5  '>
                أول منصة مغاربية لتعلم {texts.map((text, i) => (
                  <div key={i} className={i === animationIndex ? 'fadeInSlide' : 'hidden'}>
                    {text}
                  </div>
                ))}
              </div>
              <button onClick={() => { window.location.href = '#mission' }} className=" active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 bg-[#7C3AED] w-fit items-center hover:bg-primary-color text-white py-[8px] px-[40px] rounded-full">
                إقرأ المزيد
              </button>
            </div>
            <div className='mb-16 sm:m-auto'>
              <img src="/images/problem-solving.svg" alt="illustration" className='sm:w-[500px] sm:h-[500px] w-[80%] mx-auto' />
            </div>
          </div>
        </div>
  )
}

export default Hero;
