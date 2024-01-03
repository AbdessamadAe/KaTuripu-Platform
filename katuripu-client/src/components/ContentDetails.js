import React from 'react'

export const ContentDetails = ({ content }) => {
    return (
        <div className='pt-[80px]'>
            <div className='ml-[60px] mr-[60px] space-y-8'>
                {content?.map((content) => (
                    <div className=' mr-[140px] ml-[140px] space-y-6 font-amiri text-right flex flex-col items-end'>
                        <h1 className='mr-[12px] text-h3'>{content.title}</h1>
                        <div className='mr-[12px] text-h6 text-[#747677]'>
                            {content.content_body}
                        </div>
                        <div className="">
                            <iframe
                                width="853"
                                height="480"
                                src={`https://www.youtube.com/embed/${content.content_video_link}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                        </div>

                    </div>

                ))}
            </div>
        </div>
    )
}
