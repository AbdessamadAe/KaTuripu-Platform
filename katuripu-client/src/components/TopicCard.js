import React from 'react'
import Math from '../images/Math.svg'

export const TopicCard = () => {
    return (
        //I did not style this! This card component was taken from https://tailwindcomponents.com/component/tailwind-css-card-with-link-by-material-tailwind
        <div class="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div class="p-6">
                <h5 class="mb-2 block font-title text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    Algebra
                </h5>
                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                    Because it's about motivating the doers. Because I'm here to follow my
                    dreams and inspire others.
                </p>
                <img src={Math} alt="Math" class="w-36 h-36 flex items-center" />
            </div>
            <div class="p-6 pt-0">
                <a
                    class="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500"
                    href="#"
                >
                    <button
                        class="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-dark="true"
                    >
                        Learn More
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
