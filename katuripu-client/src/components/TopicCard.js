import React from 'react'
import Math from '../images/Math.svg'

export const TopicCard = ({topic}) => {
    return (
        //I did not style this! This styling was taken from https://tailwindcomponents.com/component/tailwind-css-card-with-link-by-material-tailwind
        <div class=" relative mt-6 flex w-96 flex-col rounded-xl font-amiri bg-white bg-clip-border text-gray-700 shadow-md">
            <div class="p-6 text-right">
                <h5 class="mb-2 block text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    {topic.topic_title}
                </h5>
                <p class="block text-base font-light leading-relaxed text-inherit antialiased">
                    {topic.topic_overview}
                </p>
                <img src={Math} alt="" class="w-36 h-36 mt-3 m-auto" />
            </div>
            <div class="p-6 pt-0">
                <a
                    class="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500"
                    href="#"
                >
                    <button
                        class="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-end align-middle font-amiri text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-dark="true"
                    >
                        تعلم المزيد
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            aria-hidden="true"
                            class="h-4 w-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            ></path>
                        </svg>
                    </button>
                </a>
            </div>
        </div>
    )
}
