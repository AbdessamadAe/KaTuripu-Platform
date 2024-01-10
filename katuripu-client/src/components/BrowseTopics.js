import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TopicCard } from './TopicCard'
import Nav from './Nav'
import { Footer } from './Footer'

export const BrowseTopics = () => {

    const [categories, setCategories] = useState();
    const [topics, setTopics] = useState([]);
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
        <div>
        <Nav/>
        <div className=' animate-slide-fade-in mt-[80px] flex flex-col items-center pt-4 font-amiri mb-12 rtl:ml-2'>
            <h1 className='text-h1 font-semibold mb-12'>تصفح المواضيع</h1>
            <div className='text-h6 flex flex-row items-center '>
                {categories?.map((category) => (
                    <div className='mr-[20px] ml-[20px]'>
                        <div onClick={() => handleCategoryChange(category.category_id)} className={`text-[#374047] cursor-pointer hover:text-primary-color ${category_id === category.category_id ? 'border-b-[2px]' : ''
                            }`}
                        >
                            {category.category_name}
                        </div>
                    </div>
                ))}
            </div>
            <div className={` justify-center border-t-[1px] border-t-[#ecf3f2] mt-4  pl-[12px] pr-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[96%]`}>
                {topics?.map((topic) => (
                    <div className=''>
                        <TopicCard topic={topic} />
                        </div>
                ))}
            </div>
        </div>
        <Footer/>
        </div>
    )
}
