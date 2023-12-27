import React from 'react'
import Nav from './Nav'
import Math from '../images/Math.svg'
import { CiBookmark } from "react-icons/ci";

const Content = () => {
    return (
        <div>
            <Nav />
            <div className='pt-[150px] pb-[80px] font-title bg-gradient-to-bl from-white via-violet-300 to-violet-400'>
                <div className='flex flex-row justify-center h-[300px] mb-4'>
                    <div className=' whitespace-pre-wrap flex flex-col justify-center pr-[12px] pl-[12px] pt-0 pb-0 w-[40%]'>
                        <p>Homepage / Calculus</p>
                        <h1 className='text-h2 font-semibold  mt-6'>Introduction to Calculus</h1>
                        <div className='flex flex-row justify-start space-x-12  mt-[48px] '>
                            <button class="border-primary-color border-2 font-semibold  w-fit items-center h-12 hover:bg-primary-color hover:text-white text-primary-color py-[8px] px-[40px] rounded-full">
                                Learn more
                            </button>
                            <CiBookmark size={40} className='m-auto' />
                        </div>
                    </div>
                    <div className='pl-2 pr-2 w-[300px] pt-0 pb-0'>
                        <img src={Math} className='m-0' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Content;
