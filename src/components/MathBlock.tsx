import React from 'react';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui';

interface MathBlockProps {
  content: string;
  className?: string;
}

const MathBlock: React.FC<MathBlockProps> = ({ content, className = '' }) => {
  return (
    <Card.Body>
      <div className="prose dark:prose-invert max-w-none">
        <MathJax dynamic>
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                return (
                  <pre className="bg-gray-200 dark:bg-gray-600 p-3 rounded overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </MathJax>
      </div>
    </Card.Body>
  );
};

export default MathBlock;
