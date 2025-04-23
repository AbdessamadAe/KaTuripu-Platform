import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from "react-icons/fa";

export const Footer: React.FC = () => {
    const d = new Date();
    return (
        <div className="max-w-screen-xl px-4 py-6 mx-auto overflow-hidden sm:px-6 lg:px-8">
            <div className="space-y-2 text-center text-gray-400 dark:text-gray-500">
                <p className="text-base leading-6 text-gray-400 dark:text-gray-500">
                    © {d.getFullYear()} KaTuripu | All Rights Reserved
                </p>
                <p className="text-sm leading-6 hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300">
                    <span className="font-light italic">Developed by </span>
                    <a
                        href="https://github.com/abdessamadae"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Abdessamad Ait Elmouden
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Footer;
