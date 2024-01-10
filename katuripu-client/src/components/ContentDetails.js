import React from 'react';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from "react-markdown";


export const ContentDetails = ({ content }) => {

  return (
    <div className='pt-[80px] mb-[80px]'>
      <div className='ml-[60px] mr-[60px] space-y-8'>
        {content?.map((contentItem, index) => (
          <div
            key={index}
            className='mr-[140px] ml-[140px] space-y-6 font-amiri text-right flex flex-col items-end'
          >
            <h1 className='mr-[12px] text-h3'>{contentItem.title}</h1>
            <div className='mr-[12px] text-h6 leading-10 text-[#464848]'>
                <MathJax dynamic hideUntilTypeset="every" >
                  <ReactMarkdown>{contentItem.content_body}</ReactMarkdown>
                </MathJax>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
