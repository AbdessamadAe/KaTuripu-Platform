import React from 'react'
import { CiBookmark } from "react-icons/ci";
import Math from '../images/Math.svg'

export const ContentHero = ({ content }) => {
    const topic_title = content.length > 0 ? content[0].topic_title : '...';
    return (
        <div className=' text-right font-amiri pt-[150px] pb-[80px] bg-gradient-to-bl from-white via-violet-300 to-violet-400'>
            <div className='flex flex-row justify-center h-[300px] mb-4'>
                <div className='pl-2 pr-2 w-[300px] pt-0 pb-0'>
                    <img src={Math} className='m-0' />
                </div>
                <div className=' whitespace-pre-wrap flex flex-col justify-center pr-[12px] pl-[12px] pt-0 pb-0 w-[40%]'>
                    <p>الرئيسية \ {topic_title}</p>
                    <h1 className='text-h2 font-semibold  mt-8'>{topic_title}</h1>
                    <div className='flex flex-row justify-end space-x-16 mt-[52px] '>
                        <CiBookmark size={40} className='mt-auto mb-auto' />
                        <button class="border-primary-color border-2 font-semibold  w-fit items-center h-12 hover:bg-primary-color hover:text-white text-primary-color py-[8px] px-[40px] rounded-full">
                            إبدأ الدرس
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
