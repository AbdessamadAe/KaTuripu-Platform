'use client';

import { ReactNode } from 'react';
import { MathJaxContext } from 'better-react-mathjax';

interface MathJaxProviderProps {
  children: ReactNode;
}

const MathJaxProvider = ({ children }: MathJaxProviderProps) => {
  const config = {
    loader: { load: ["input/asciimath", "input/tex", "output/chtml"] },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
    },
    chtml: {
      scale: 1,
      minScale: 0.5,
      mtextInheritFont: true,
      matchFontHeight: true,
      displayAlign: "left",
      displayIndent: "0",
    },
    startup: {
      typeset: true,
    }
  };

  return (
    <MathJaxContext config={config}>
      {children}
    </MathJaxContext>
  );
};

export default MathJaxProvider; 