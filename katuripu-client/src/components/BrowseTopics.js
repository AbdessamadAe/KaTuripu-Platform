import React from 'react'
import { TopicCard } from './TopicCard'

export const BrowseTopics = () => {
    return (
        <div className='flex flex-col items-center my-8 text-center font-title mb-12'>
            <h1 className='text-h2 font-semibold mb-4'>Browse Topics</h1>
            <div className='text-h6 space-x-[20px] '>
                <a href='#' className=' text-gray-400 selection:border-b-[1.5px] hover:text-primary-color'>
                    Calculus
                </a>
                <span className=' text-gray-400'> | </span>
                <a href='#' className=' text-gray-400 hover:text-primary-color'>
                    Algebra
                </a>
                <span className='text-gray-400'> | </span>
                <a href='#' className=' text-gray-400 hover:text-primary-color'>
                    Geometry
                </a>
                <span className='text-gray-400'> | </span>
                <a href='#' className=' text-gray-400 hover:text-primary-color'>
                    Trigonometry
                </a>
            </div>
            <div className='border-t-[1px] border-t-[#ecf3f2] mt-4  pl-[12px] pr-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <TopicCard />
            </div>
        </div>
    )
}
