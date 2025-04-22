import React from 'react';
import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatarUrl?: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  content, 
  author, 
  role, 
  avatarUrl,
  rating
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-xl"></div>
      <div className="absolute -left-4 -top-4 w-20 h-20 bg-purple-100/40 dark:bg-purple-900/20 rounded-full blur-xl"></div>
      
      {/* Quote icon */}
      <div className="mb-6 flex items-center justify-between">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
            />
          ))}
        </div>
      </div>
      
      {/* Testimonial text */}
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6 relative z-10">
        <p className="leading-relaxed italic">{content}</p>
      </blockquote>
      
      {/* Author info */}
      <footer className="flex items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
            <UserCircleIcon className="w-8 h-8" />
          </div>
        )}
        <div className="ml-4">
          <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </footer>
    </div>
  );
};

interface TestimonialsProps {
  id?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ id = "testimonials" }) => {
  const t = useTranslations('testimonials');
  
  const testimonialData = [
    {
      content: t('testimonial1.content'),
      author: t('testimonial1.author'),
      role: t('testimonial1.role'),
      avatarUrl: "/images/testimonials/student1.jpg",
      rating: 5
    },
    {
      content: t('testimonial2.content'),
      author: t('testimonial2.author'),
      role: t('testimonial2.role'),
      avatarUrl: "/images/testimonials/student2.jpg",
      rating: 5
    },
    {
      content: t('testimonial3.content'),
      author: t('testimonial3.author'),
      role: t('testimonial3.role'),
      avatarUrl: "/images/testimonials/student3.jpg", 
      rating: 4
    }
  ];

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            <span className="relative">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 blur-lg opacity-30"></span>
              <span className="relative">{t('heading')}</span>
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t('subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {testimonialData.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
              rating={testimonial.rating}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="/roadmap"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {t('actionButton')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
