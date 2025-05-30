'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
// Import icons from react-icons
import { HiHome, HiChevronRight } from 'react-icons/hi2';

interface BreadcrumbItem {
  label: string;
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
              <HiHome className="h-5 w-5" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <HiChevronRight className="h-6 w-6 text-gray-400" />
              
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