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
            <div className='font-amiri min-h-screen animate-slide-fade-in mt-[60px] p-8 md:px-6 dark:bg-gray-900'>
                <div className='text-center text-4xl font-semibold mb-8 font-amiri bg-purple-text-bg w-fit m-auto bg-no-repeat bg-center bg-cover px-16 dark:text-white'> {t('title')} </div>
                <div className="flex items-center xl:h-scree">
                    <div className="p-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-4 lg:gap-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="flex flex-wrap mb-0 overflow-hidden bg-white dark:bg-gray-800 rounded shadow dark:shadow-gray-700">
                                    <div className="relative w-full overflow-hidden lg:w-2/5 h-72">
                                        <img className="object-cover w-full h-full transition-all hover:scale-110" src={member.image} alt={member.name} />
                                    </div>
                                    <div className={`items-center self-center flex-1 p-6 ${!isLTR ? 'dir-rtl' : ''}`}>
                                        <div className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">{member.name}</div>
                                        <span className="inline-block mb-4 text-base font-medium text-blue-500 dark:text-blue-400">
                                            {member.title}
                                        </span>
                                        <p className="mb-4 text-sm leading-7 text-gray-500 dark:text-gray-300">
                                            {member.bio}
                                        </p>
                                        <div className="flex items-center justify-start">
                                            {member.socialLinks.linkedin && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400 dark:text-gray-400 dark:hover:text-gray-300" href={member.socialLinks.linkedin}>
                                                    <FaLinkedin className='w-6 h-6' />
                                                </a>
                                            )}
                                            {member.socialLinks.github && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400 dark:text-gray-400 dark:hover:text-gray-300" href={member.socialLinks.github}>
                                                    <FaGithub className='w-6 h-6' />
                                                </a>
                                            )}
                                            {member.socialLinks.facebook && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400 dark:text-gray-400 dark:hover:text-gray-300" href={member.socialLinks.facebook}>
                                                    <FaFacebook className='w-6 h-6' />
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
        </div>
    )
}