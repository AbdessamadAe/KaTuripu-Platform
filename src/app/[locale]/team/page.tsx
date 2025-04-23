import React from 'react'
import { Footer } from '../../../components/Footer'
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";
import { useLocale, useTranslations } from 'next-intl';
interface TeamMember {
    name: string;
    title: string;
    bio: string;
    image: string;
    socialLinks: {
        linkedin?: string;
        github?: string;
        facebook?: string;
    }
}

export default function Team () {
    const locale = useLocale();
    const t = useTranslations('team');
    const isLTR = locale === 'en' || locale === 'fr';
    const teamMembers: TeamMember[] = [
        {
            name: t('member1.name'),
            title: t('member1.title'),
            bio: t('member1.bio'),
            image: "/images/abdessamad.jpeg",
            socialLinks: {
                linkedin: "#",
                github: "#",
                facebook: "#"
            }
        },
        {
            name: t('member2.name'),
            title: t('member2.title'),
            bio: t('member2.bio'),
            image: "/images/achraf.jpg",
            socialLinks: {
                linkedin: "#",
                github: "#",
                facebook: "#"
            }
        }
    ];

    return (
        <div>
            <div className='min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-16 pb-16 px-4 sm:px-6 lg:px-8'>
                {/* Page header with decorative elements */}
                <div className="relative text-center mb-16">
                    {/* Decorative blobs */}
                    <div className="absolute -z-10 left-1/4 top-0 w-24 h-24 bg-blue-200 dark:bg-blue-800/40 rounded-full blur-2xl opacity-60"></div>
                    <div className="absolute -z-10 right-1/4 top-10 w-32 h-32 bg-purple-200 dark:bg-purple-800/40 rounded-full blur-2xl opacity-60"></div>
                    
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        <span className="relative">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7d9bbf] to-[#f0b9ae] blur-lg opacity-30"></span>
                            <span className="relative">{t('title')}</span>
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        {t('description')}
                    </p>
                </div>
                
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={index} 
                                className="bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e9e3ff]/60 dark:border-gray-700/50 flex flex-col lg:flex-row"
                            >
                                {/* Image container with gradient overlay */}
                                <div className="relative w-full lg:w-2/5 h-80 lg:h-auto overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 lg:hidden"></div>
                                    <img 
                                        className="object-cover w-full h-full transition-all duration-500 hover:scale-110" 
                                        src={member.image} 
                                        alt={member.name} 
                                    />
                                </div>
                                
                                {/* Content container with improved spacing */}
                                <div className={`flex-1 p-6 lg:p-8 flex flex-col justify-between relative ${!isLTR ? 'dir-rtl' : ''}`}>
                                    {/* Decorative elements */}
                                    <div className="absolute -z-10 -right-6 -bottom-6 w-24 h-24 bg-[#a7d1cf]/30 dark:bg-[#a7d1cf]/15 rounded-full blur-xl opacity-60"></div>
                                    <div className="absolute -z-10 -left-6 -top-6 w-16 h-16 bg-[#f0b9ae]/30 dark:bg-[#f0b9ae]/15 rounded-full blur-xl opacity-50"></div>
                                    
                                    {/* Member information */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h2>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#e9e3ff] text-[#5a8aaf] dark:bg-[#5a8aaf]/20 dark:text-[#7d9bbf] mb-4">
                                            {member.title}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                    
                                    {/* Social links with enhanced styling */}
                                    <div className="flex items-center mt-6 pt-4 border-t border-[#e9e3ff]/40 dark:border-gray-700">
                                        {member.socialLinks.linkedin && (
                                            <a 
                                                className="mr-4 p-2 rounded-full bg-[#e9e3ff]/50 dark:bg-gray-700 text-[#5a8aaf] dark:text-[#7d9bbf] hover:bg-[#5a8aaf] hover:text-white dark:hover:bg-[#5a8aaf] transition-all duration-200" 
                                                href={member.socialLinks.linkedin}
                                                aria-label="LinkedIn"
                                            >
                                                <FaLinkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.socialLinks.github && (
                                            <a 
                                                className="mr-4 p-2 rounded-full bg-[#e9e3ff]/50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-600 transition-all duration-200" 
                                                href={member.socialLinks.github}
                                                aria-label="GitHub"
                                            >
                                                <FaGithub className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.socialLinks.facebook && (
                                            <a 
                                                className="mr-4 p-2 rounded-full bg-[#e9e3ff]/50 dark:bg-gray-700 text-[#5a8aaf] dark:text-[#7d9bbf] hover:bg-[#5a8aaf] hover:text-white dark:hover:bg-[#5a8aaf] transition-all duration-200" 
                                                href={member.socialLinks.facebook}
                                                aria-label="Facebook"
                                            >
                                                <FaFacebook className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}