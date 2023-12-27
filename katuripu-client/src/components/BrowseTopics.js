import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { TopicCard } from './TopicCard'

export const BrowseTopics = () => {
    const [categories, setCategories] = useState();

    useEffect( () => {
        axios.get('http://localhost:3001/categories').then((res) => {
            setCategories(res.data);
        })
    }, [])

    return (
        <div className='flex flex-col items-center my-8 text-center font-title mb-12'>
            <h1 className='text-h2 font-semibold mb-4'>Browse Topics</h1>
            <div className='text-h6 space-x-[40px] '>
                {categories?.map((category) => (
                    <a className=' text-gray-400 selection:border-b-[1.5px] cursor-pointer hover:text-primary-color'>
                    {category.category_name}
                </a>
                ))}
                
            </div>
            <div className='w-[80%] border-t-[1px] border-t-[#ecf3f2] mt-4  pl-[12px] pr-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <TopicCard />
            </div>
        </div>
    )
}
