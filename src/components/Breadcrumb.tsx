'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-5 px-4 sm:px-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center space-x-1 text-md">
          <li className="flex items-center">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-[#69c0cf] dark:hover:text-[#c7e9ef] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#69c0cf] dark:hover:text-[#b9dbe1] truncate max-w-[180px] inline-block align-bottom transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-[#69c0cf] dark:text-[#b9dbe1] font-medium truncate max-w-[180px] inline-block align-bottom">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;