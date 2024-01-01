import React, { useState, useEffect } from 'react'
import Nav from './Nav';
import { ContentHero } from './ContentHero';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ContentDetails } from './ContentDetails';

const ContentPage = () => {
    const { topic_id } = useParams();
    const [content, setContent] = useState();

    useEffect(() => {
        axios.get(`http://localhost:3001/content/${topic_id}`).then((res) => {
            setContent(res.data);
        })
    }, [topic_id])


    return (
        <div>
            <Nav />
            <ContentHero content={content} />
            <ContentDetails content={content} />
        </div>
    )
}

export default ContentPage;
