import React from 'react'
import Nav from './Nav'
import { Footer } from './Footer'
import achraf from '../images/achraf.jpg'
import abdessamad from '../images/abdessamad.jpeg'
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";


export const AboutUs = () => {
    return (
        <div>
            <Nav />
            <div className=' font-amiri animate-slide-fade-in mt-[80px] p-8 md:px-6'>
                <div className='text-center text-h1 font-semibold mb-8 font-amiri bg-purple-text-bg w-fit m-auto bg-no-repeat bg-center bg-cover px-16'> فريقنا </div>
                <div class="flex items-center xl:h-scree">
                    <div class="p-4 mx-auto max-w-7xl">
                        <div class="grid grid-cols-1 gap-4 lg:gap-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            <div class="flex flex-wrap mb-0 overflow-hidden bg-white rounded shadow">
                                <div class="relative w-full overflow-hidden lg:w-2/5 h-72">
                                    <img class="object-cover w-full h-full transition-all hover:scale-110" src={abdessamad} alt="" />
                                </div>
                                <div dir='rtl' class="items-center self-center flex-1 p-6">
                                    <div class="mb-1 text-2xl font-semibold text-gray-800">عبد الصمد أيت المودن</div>
                                    <span class="inline-block mb-4 text-base font-medium text-blue-500">
                                        صديق بائع القهوة</span>
                                    <p class="mb-4 text-sm leading-7 text-gray-500">
                                        طالب بسلك البكالوريوس بجامعة الأخوين بإفران، تخصص علوم الحاسوب والرياضيات.
                                    </p>
                                    <div class="flex items-center justify-start">
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaLinkedin className='w-6 h-6' />
                                        </a>
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaGithub className='w-6 h-6' />
                                        </a>
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaFacebook className='w-6 h-6' />
                                        </a>
                                    </div>
                                </div>

                            </div>
                            <div class="flex flex-wrap mb-0 overflow-hidden bg-white rounded shadow">
                                <div class="relative w-full overflow-hidden lg:w-2/5 h-72">
                                    <img class="object-cover w-full h-full transition-all hover:scale-110" src={achraf} alt="" />
                                </div>
                                <div dir='rtl' class="items-center self-center flex-1 p-6">
                                    <div class="mb-1 text-2xl font-semibold text-gray-800">أشرف أجغوغ</div>
                                    <span class="inline-block mb-4 text-base font-medium text-blue-500">
                                        بائع قهوة</span>
                                    <p class="mb-4 text-sm leading-7 text-gray-500">
                                    طالب بسلك الماستر بجامعة الأخوين بإفران، تخصص تحليلات البيانات الضخمة. 
                                    </p>
                                    <div class="flex items-center justify-start">
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaLinkedin className='w-6 h-6' />
                                        </a>
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaGithub className='w-6 h-6' />
                                        </a>
                                        <a class="inline-block mr-5 text-coolGray-300 hover:text-coolGray-400" href="#">
                                            <FaFacebook className='w-6 h-6' />
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
