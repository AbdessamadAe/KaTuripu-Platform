import React from 'react'
import Nav from '../../components/client/Nav'
import { Footer } from '../../components/client/Footer'
// import achraf from '../images/achraf.jpg'
// import abdessamad from '../images/abdessamad.jpeg'
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

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
    const teamMembers: TeamMember[] = [
        {
            name: "عبد الصمد أيت المودن",
            title: "صاحب مول القهوة",
            bio: "طالب بسلك البكالوريوس بجامعة الأخوين بإفران، تخصص علوم الحاسوب والرياضيات.",
            image: "/images/abdessamad.jpeg",
            socialLinks: {
                linkedin: "#",
                github: "#",
                facebook: "#"
            }
        },
        {
            name: "أشرف أجغوغ",
            title: "مول القهوة",
            bio: "خريج سلك الماستر بجامعة الأخوين بإفران، تخصص تحليل البيانات الضخمة.",
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
            <Nav />
            <div className='font-amiri animate-slide-fade-in mt-[80px] p-8 md:px-6'>
                <div className='text-center text-4xl font-semibold mb-8 font-amiri bg-purple-text-bg w-fit m-auto bg-no-repeat bg-center bg-cover px-16'> فريقنا </div>
                <div className="flex items-center xl:h-scree">
                    <div className="p-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-4 lg:gap-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="flex flex-wrap mb-0 overflow-hidden bg-white rounded shadow">
                                    <div className="relative w-full overflow-hidden lg:w-2/5 h-72">
                                        <img className="object-cover w-full h-full transition-all hover:scale-110" src={member.image} alt={member.name} />
                                    </div>
                                    <div dir='rtl' className="items-center self-center flex-1 p-6">
                                        <div className="mb-1 text-2xl font-semibold text-gray-800">{member.name}</div>
                                        <span className="inline-block mb-4 text-base font-medium text-blue-500">
                                            {member.title}
                                        </span>
                                        <p className="mb-4 text-sm leading-7 text-gray-500">
                                            {member.bio}
                                        </p>
                                        <div className="flex items-center justify-start">
                                            {member.socialLinks.linkedin && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href={member.socialLinks.linkedin}>
                                                    <FaLinkedin className='w-6 h-6' />
                                                </a>
                                            )}
                                            {member.socialLinks.github && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href={member.socialLinks.github}>
                                                    <FaGithub className='w-6 h-6' />
                                                </a>
                                            )}
                                            {member.socialLinks.facebook && (
                                                <a className="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href={member.socialLinks.facebook}>
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
            <Footer />
        </div>
    )
}