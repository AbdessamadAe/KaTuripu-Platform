import React from 'react'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

//React-katex is not working. needs to be fixed

export const ContentDetails = ({ content }) => {

    return (
        <div className='pt-[80px] mb-[80px]'>
            <div className='ml-[60px] mr-[60px] space-y-8'>
                {content?.map((content) => (
                    <div className=' mr-[140px] ml-[140px] space-y-6 font-amiri text-right flex flex-col items-end'>
                        <h1 className='mr-[12px] text-h3'>{content.title}</h1>
                        <div className='mr-[12px] text-h6 text-[#747677]'>
                            {content.content_body.split(/(\$\$|\$)/).map((part, index) =>
                                part.startsWith('$') && part.endsWith('$') ? (
                                    <InlineMath key={index} math={part.replace(/\$/g, '')} />
                                ) : (
                                    <span key={index}>{part}</span>
                                )
                            )}
                        </div>
                        <div className="">
                            <iframe
                                width="853"
                                height="480"
                                src={`https://www.youtube.com/embed/${content.content_video_link}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={content.title}
                            />
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
