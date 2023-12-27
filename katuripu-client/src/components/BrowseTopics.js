import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TopicCard } from './TopicCard'

export const BrowseTopics = () => {
    const [categories, setCategories] = useState();
    const [topics, setTopics] = useState();
    const [category_id, setCategory_id] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:3001/categories').then((res) => {
            setCategories(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3001/topics/${category_id}`).then((res) => {
            setTopics(res.data);
        })
    }, [category_id])

    const handleCategoryChange = (newcategory_id) => {
        setCategory_id(newcategory_id);
    }

    return (
        <div className='flex flex-col items-center my-8 font-amiri mb-12 text-right'>
            <h1 className='text-h2 font-semibold mb-6'>تصفح المواضيع</h1>
            <div className='text-h6 '>
                {categories?.map((category) => (
                    <a onClick={() => handleCategoryChange(category.category_id)} className=' mr-[20px] ml-[20px] text-gray-400 selection:border-b-[1.5px] cursor-pointer hover:text-primary-color'>
                        {category.category_name}
                    </a>
                ))}
            </div>
            <div className=' border-t-[1px] border-t-[#ecf3f2] mt-4  pl-[12px] pr-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {topics?.map((topic) => (
                    <TopicCard topic={topic} />
                ))}
            </div>
        </div>
    )
}
