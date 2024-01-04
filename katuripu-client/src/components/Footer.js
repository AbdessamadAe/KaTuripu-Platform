import React from 'react'
import { FaFacebook, FaInstagram , FaTiktok, FaYoutube, FaLinkedin    } from "react-icons/fa";


export const Footer = () => {
    const d = new Date();
    return (
        <div class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
            <div class="flex justify-center mt-8 space-x-6">
                <a href="https://www.youtube.com/@KaTuripu" class="text-gray-400 hover:text-gray-500">
                    <FaYoutube className='w-6 h-6' />
                </a>
                <a href="https://www.linkedin.com/company/katuripu" class="text-gray-400 hover:text-gray-500">
                    <FaLinkedin className='w-6 h-6' />
                </a>
                <a href="https://www.facebook.com/KaTuriipu/" class="text-gray-400 hover:text-gray-500">
                    <FaFacebook className='w-6 h-6' />      
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-500">
                    <FaInstagram  className='w-6 h-6' />
                </a>
                <a href="https://www.tiktok.com/@katuripu?lang=en" class="text-gray-400 hover:text-gray-500">
                    <FaTiktok className='w-6 h-6' />
                </a>
            </div>
            <p class="mt-8 text-base leading-6 text-center text-gray-400">
                    © {d.getFullYear()} KaTuripu | All Rights Reserved
            </p>
        </div>
    )
}

