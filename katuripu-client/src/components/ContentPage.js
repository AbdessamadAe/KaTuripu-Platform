import React, { useState, useEffect } from 'react'
import Nav from './Nav';
import { ContentHero } from './ContentHero';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ContentDetails } from './ContentDetails';
import { Footer } from './Footer';

const ContentPage = () => {
    const { topic_id } = useParams();
    const [content, setContent] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/content/${topic_id}`).then((res) => {
            setContent(res.data);
        })
    }, [topic_id])


    return (
        <div className=''>
            <Nav />
            <ContentHero content={content} />
            <ContentDetails content={content} />
            <Footer />
        </div>
    )
}

export default ContentPage;
