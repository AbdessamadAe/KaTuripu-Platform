import React from 'react'
// import Math from '../images/Math.svg'

interface Topic {
    topicId: number;
    topicTitle: string;
    topicOverview: string;
    topicContent?: string;
    topicImageUrl?: string;
    topicAdditionalResources?: string;
}

interface TopicCardProps {
    topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
    return (
        <div className='relative ml-0 mr-0 sm:mr-10'>
            <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-[#A78BFA] rounded-lg"></span>
            <div className=" h-full p-5 border-2 border-[#A78BFA] transition duration-300 hover:scale-105 relative mt-6 flex flex-col rounded-xl font-amiri bg-white bg-clip-border text-gray-700">
                <div className=" p-[40px] pt-[24px] text-right">
                    <h5 className="block mb-[10px] text-xl font-semibold tracking-normal text-[#374047]">
                        {topic.topicTitle}
                    </h5>
                    <p className="block font-light leading-relaxed">
                        {topic.topicOverview}
                    </p>
                    <img src="/images/Math.svg" alt="" className="w-36 h-36 mt-4 m-auto" />
                </div>
                <div className="p-6 pt-0">
                    <a
                        className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500"
                        href={`/content/${topic.topicId}`}
                    >
                        <button
                            className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-end align-middle font-amiri text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-dark="true"
                        >
                            تعلم المزيد
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                ></path>
                            </svg>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TopicCard;
