import React from 'react'
import illustration from '../images/problem-solving.svg'

const Hero = () => {
  return (
    <div>
      <div className='pt-[50px]  w-full h-screen m-t-[-96px] mx-auto flex items-center justify-center space-x-[100px]'>
        <div className='flex flex-col text-center items-center font-amiri'>
          <h1 className=' text-[#1F2937] pb-6 font-bold text-h1 '>
            إكتشف. تعلم. إستمتع
          </h1>
          <h6 className='text-primary-color pb-8  font-bold text-h6'>
            أول منصة مغاربية لتعلم الرياضيات
          </h6>
          <button class="bg-[#7C3AED] w-fit items-center hover:bg-primary-color text-white py-[8px] px-[40px] rounded-full">
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