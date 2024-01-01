import React from 'react'

export const ContentDetails = ({ content }) => {
    return (
        <div className='m-auto'>
            {content?.map((content) => (
            <div className='font-amiri text-right flex flex-col items-end'>
                <h1 className=''>تعريف الإشتقاق</h1>
                <div></div>
                <iframe className='m-auto mt-8 mb-8'
                    title='Youtube player'
                    sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                    src={`https://youtube.com/embed/${content.content_video_link}?autoplay=0`}>
                </iframe> 
            </div>
            ))}
        </div>
    )
}
