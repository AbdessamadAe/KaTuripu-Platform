import React, { useState, useEffect } from 'react'
import illustration from '../images/problem-solving.svg'

const Hero = () => {
  const texts = ['الرياضيات', 'الخوارزميات', 'علوم الحاسوب'];
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setAnimationIndex((current) => (current + 1) % texts.length);
    }, 3000);

    return () => clearInterval(intervalID);
  }, [texts.length]);

  return (
    <div>
      <div className='pt-[50px] animate-slide-fade-in  w-full h-screen m-t-[-96px] mx-auto flex items-center justify-center space-x-[100px]'>
        <div className='flex flex-col text-center items-center font-amiri'>
          <h1 className=' text-[#1F2937] pb-6 font-bold text-h1 '>
            إكتشف. تعلم. إستمتع
          </h1>
          <div className='text-primary-color pb-8  font-bold text-h6'>
            أول منصة مغاربية لتعلم {texts.map((text, i) => (
              <div key={i} className={i === animationIndex ? 'fadeInSlide' : 'hidden'}>
                {text}
              </div>
            ))}
          </div>
          <button onClick={() => { window.location.href = '/BrowseTopics' }} class=" active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 bg-[#7C3AED] w-fit items-center hover:bg-primary-color text-white py-[8px] px-[40px] rounded-full">
            إقرأ المزيد
          </button>
        </div>
        <div>
          <img src={illustration} alt="illustration" className='w-[500px] h-[500px] mx-auto' />
        </div>
      </div>
    </div>
  )
}

export default Hero;