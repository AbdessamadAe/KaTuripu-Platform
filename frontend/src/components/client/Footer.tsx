import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from "react-icons/fa";

export const Footer: React.FC = () => {
    const d = new Date();
    return (
        <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
            <div className="flex justify-center mt-8 space-x-6">
                <a href="https://www.youtube.com/@KaTuripu" className="text-gray-400 hover:text-gray-500">
                    <FaYoutube className='w-6 h-6' />
                </a>
                <a href="https://www.linkedin.com/company/katuripu" className="text-gray-400 hover:text-gray-500">
                    <FaLinkedin className='w-6 h-6' />
                </a>
                <a href="https://www.facebook.com/KaTuriipu/" className="text-gray-400 hover:text-gray-500">
                    <FaFacebook className='w-6 h-6' />      
                </a>
                <a href="https://www.instagram.com/katuriipu/" className="text-gray-400 hover:text-gray-500">
                    <FaInstagram className='w-6 h-6' />
                </a>
                <a href="https://www.tiktok.com/@katuripu?lang=en" className="text-gray-400 hover:text-gray-500">
                    <FaTiktok className='w-6 h-6' />
                </a>
            </div>
            <p className="mt-8 text-base leading-6 text-center text-gray-400">
                    © {d.getFullYear()} KaTuripu | All Rights Reserved
            </p>
        </div>
    )
}

export default Footer;
