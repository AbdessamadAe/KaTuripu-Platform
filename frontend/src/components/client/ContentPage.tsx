import React, { useState, useEffect } from 'react'
import Nav from './Nav';
import { ContentHero } from './ContentHero';
import { ContentDetails } from './ContentDetails';
import { Footer } from './Footer';
import axios from 'axios';
import { useRouter } from 'next/router';

interface ContentItem {
    contentId: number;
    topicId: number;
    title: string;
    contentBody: string;
    createdAt?: string;
    contentVideoLink?: string;
    contentOrder?: number;
}

const ContentPage: React.FC = () => {
    const router = useRouter();
    const { topic_id } = router.query;
    const [content, setContent] = useState<ContentItem[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    useEffect(() => {
        if (topic_id) {
            axios.get(`${apiUrl}/content/${topic_id}`)
                .then((res) => {
                    setContent(res.data);
                })
                .catch((error) => {
                    console.error(`Error fetching content for topic ${topic_id}:`, error);
                });
        }
    }, [topic_id, apiUrl]);

    return (
        <div className=''>
            <Nav />
            <ContentHero content={content} />
            <ContentDetails content={content} />
            <Footer />
        </div>
    );
};

export default ContentPage;
