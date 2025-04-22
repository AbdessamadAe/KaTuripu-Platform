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
    <div className="bg-white dark:bg-gray-800/90 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#c5b3ff]/60 dark:border-gray-700/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#66c2bc]/40 dark:bg-[#66c2bc]/20 rounded-full blur-xl"></div>
      <div className="absolute -left-4 -top-4 w-20 h-20 bg-[#ff9d8a]/40 dark:bg-[#ff9d8a]/20 rounded-full blur-xl"></div>
      
      {/* Quote icon */}
      <div className="mb-6 flex items-center justify-between">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#c5b3ff]/80 to-[#ff9d8a]/40 dark:from-[#c5b3ff]/30 dark:to-[#ff9d8a]/30">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#4a7ab0] dark:text-[#6b9bd1]" />
        </div>
        
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-5 h-5 ${i < rating ? 'text-[#ff8066]' : 'text-gray-200 dark:text-gray-700'}`} 
            />
          ))}
        </div>
      </div>
      
      {/* Testimonial text */}
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6 relative z-10">
        <p className="leading-relaxed italic">{content}</p>
      </blockquote>
      
      {/* Author info */}
      <footer className="flex items-center mt-6 pt-4 border-t border-[#c5b3ff]/40 dark:border-gray-700">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#66c2bc]/40 dark:border-gray-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a7ab0] to-[#6b9bd1] flex items-center justify-center text-white">
            <UserCircleIcon className="w-8 h-8" />
          </div>
        )}
        <div className="ml-4">
          <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
          <p className="text-sm text-[#4a7ab0] dark:text-[#6b9bd1]">{role}</p>
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
    <section id={id} className="py-20 bg-gradient-to-b from-white to-[#eae6ff] dark:from-gray-900 dark:to-indigo-900/30 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-[#66c2bc]/40 dark:bg-[#66c2bc]/20 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-[#ff9d8a]/30 dark:bg-[#ff9d8a]/20 rounded-full blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            <span className="relative">
              <span className="absolute dark:hidden inset-0 w-full h-full bg-gradient-to-r from-[#66c2bc] to-[#ff9d8a] blur-lg opacity-40"></span>
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
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-[#4a7ab0] to-[#6b9bd1] hover:from-[#3d699d] hover:to-[#588ac0] shadow-md hover:shadow-lg transition-all duration-300"
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
