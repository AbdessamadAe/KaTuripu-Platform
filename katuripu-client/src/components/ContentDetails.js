import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';


export const ContentDetails = ({ content }) => {

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]]
    }
  };

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
              <MathJaxContext config={config} version={3}>
                <MathJax>
                  {contentItem.content_body}
                </MathJax>
              </MathJaxContext>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
