import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TopicCard } from './TopicCard'
import Nav from './Nav'
import { Footer } from './Footer'
import { PacmanLoader } from 'react-spinners'

interface Subject {
    subjectId: number;
    subjectName: string;
}

interface Topic {
    topicId: number;
    subjectId: number;
    topicTitle: string;
    topicOverview: string;
    topicContent?: string;
    topicImageUrl?: string;
    topicAdditionalResources?: string;
}

export const BrowseTopics: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjectId, setSubjectId] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${apiUrl}/subjects`)
            .then((res) => {
                setSubjects(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
                setIsLoading(false);
            });
    }, [apiUrl]);

    useEffect(() => {
        axios.get(`${apiUrl}/topics/${subjectId}`)
            .then((res) => {
                setTopics(res.data);
            })
            .catch((error) => {
                console.error(`Error fetching topics for subject ${subjectId}:`, error);
            });
    }, [subjectId, apiUrl]);

    const handleSubjectChange = (newSubjectId: number): void => {
        setSubjectId(newSubjectId);
    }

    return (
        <div>
            <Nav />
            <div className='animate-slide-fade-in mt-[100px] flex flex-col items-center pt-8 sm:pt-4 font-amiri mb-12 rtl:ml-2'>
                <h1 className=' text-4xl sm:text-h2 font-semibold mb-12'>تصفح المواضيع</h1>
                <div className={` mt-6 ${isLoading ? 'block' : 'hidden'}`}>
                    <PacmanLoader color="#A78BFA" />
                    <p dir='rtl' className='mt-6 font-amiri text-h6'>في طور التحميل...</p>
                </div>
                <div className='text-h6 flex flex-row items-center '>
                    {subjects?.map((subject) => (
                        <div key={subject.subjectId} className='mr-[20px] ml-[20px]'>
                            <div 
                                onClick={() => handleSubjectChange(subject.subjectId)} 
                                className={`text-[#374047] cursor-pointer hover:text-primary-color ${subjectId === subject.subjectId ? 'border-b-[2px]' : ''}`}
                            >
                                {subject.subjectName}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={` justify-center border-t-[1px] border-t-[#ecf3f2] mt-4  pl-[12px] pr-[12px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[96%]`}>
                    {topics?.map((topic) => (
                        <div key={topic.topicId}>
                            <TopicCard topic={topic} />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default BrowseTopics;
