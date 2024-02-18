import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TopicCard } from './TopicCard'
import Nav from './Nav'
import { Footer } from './Footer'

export const BrowseTopics = () => {

    const [subjects, setsubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subject_id, setsubject_id] = useState(1);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/subjects`).then((res) => {
            setsubjects(res.data);
            console.log(subjects);

        })
    }, [subjects])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/topics/${subject_id}`).then((res) => {
            setTopics(res.data);
        })
    }, [subject_id])

    const handlesubjectChange = (newsubject_id) => {
        setsubject_id(newsubject_id);
    }

    return (
        <div>
        <Nav/>
        <div className='animate-slide-fade-in mt-[80px] flex flex-col items-center pt-8 sm:pt-4 font-amiri mb-12 rtl:ml-2'>
            <h1 className=' text-4xl sm:text-h2 font-semibold mb-12'>تصفح المواضيع</h1>
            <div className='text-h6 flex flex-row items-center '>
                {subjects?.map((subject) => (
                    <div className='mr-[20px] ml-[20px]'>
                        <div onClick={() => handlesubjectChange(subject.subjectId)} className={`text-[#374047] cursor-pointer hover:text-primary-color ${subject_id === subject.subjectId ? 'border-b-[2px]' : ''
                            }`}
                        >
                            {subject.subjectName}
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
