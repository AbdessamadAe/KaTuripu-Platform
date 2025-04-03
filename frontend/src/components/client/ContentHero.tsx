import React from 'react'
import { CiBookmark } from "react-icons/ci";
// import Math from '../images/Math.svg'

interface ContentItem {
    contentId: number;
    topicId: number;
    title: string;
    contentBody: string;
    createdAt?: string;
    contentVideoLink?: string;
    contentOrder?: number;
}

interface ContentHeroProps {
    content: ContentItem[];
}

export const ContentHero: React.FC<ContentHeroProps> = ({ content }) => {
    const topic_title = content.length > 0 ? content[0].title : '...';
    
    return (
        <div className='text-right font-amiri pt-[150px] pb-[80px] bg-gradient-to-bl px-6 sm:px-0 from-white via-violet-300 to-violet-400'>
            <div className='flex flex-col-reverse sm:flex-row justify-center h-[300px] mb-4'>
                <div className='hidden sm:block px-auto sm:p-2 w-[300px] sm:my-auto mt-8 flex justify-center mx-auto sm:mx-0 items-center pt-0 pb-0'>
                    <img src="/images/Math.svg" alt='math' className='m-0 w-[160px] sm:w-full' />
                </div>
                <div className=' whitespace-pre-wrap flex flex-col justify-center sm:pr-[12px] sm:pl-[12px] pt-0 pb-0 sm:w-[40%]'>
                    <p>الرئيسية \ {topic_title}</p>
                    <h1 className='text-h5 font-semibold sm:text-h3  mt-8'>{topic_title}</h1>
                    <div className=' block sm:hidden px-auto sm:p-2 w-[300px] sm:my-auto mt-8 flex justify-center mx-auto sm:mx-0 items-center pt-0 pb-0'>
                        <img src="/images/Math.svg" alt='math' className='m-0 w-[160px] sm:w-full' />
                    </div>
                    <div className='flex flex-row justify-end space-x-16 mt-[52px] '>
                        <CiBookmark size={40} className='mt-auto mb-auto' />
                        <button className="border-primary-color text-[16px] border-2 font-semibold w-fit items-center h-fit hover:bg-primary-color hover:text-white text-primary-color py-[8px] px-[40px] rounded-full">
                            إبدأ الدرس
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentHero;
