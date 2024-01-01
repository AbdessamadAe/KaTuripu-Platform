import React, { useState } from 'react'
import logo from '../images/Logo.png'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { PiUserDuotone } from "react-icons/pi";


const Nav = () => {
    const [showMenu, setShowMenu] = useState(true)

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    const [NavColorChanged, setNavColorChanged] = useState(false);

    const changeNavColor = () => {
        if (window.scrollY >= 40) {
            setNavColorChanged(true);
        } else {
            setNavColorChanged(false);
        }
    }
    window.addEventListener('scroll', changeNavColor);

    return (
        <div>
            <nav className={!NavColorChanged ? 'top-0 fixed z-10 text-black  w-full font-title text-menu flex justify-between items-center h-20 mx-auto px-4 pt-8 pb-8 uppercase bg-transparent'
            :'top-0 fixed z-10 text-black w-full font-title text-menu flex justify-between shadow-sm items-center h-20 mx-auto px-4 pt-8 pb-8 uppercase bg-white'}>
                <div className='container flex justify-between items-center pl-14 pr-14'>
                <img src={logo} alt="logo" onClick={() => window.location.href = `/`} className=' cursor-pointer w-[143px] h-auto' />
                    <ul className='hidden md:flex items-center space-x-4'>
                        <li className='p-4 rounded-md cursor-pointer hover:text-primary-color '>Home</li>
                        <li className='p-4 rounded-md cursor-pointer hover:text-primary-color '>Browse Topics</li>
                        <li className='p-4 rounded-md cursor-pointer hover:text-primary-color '>How it Works</li>
                        <li className='p-4 rounded-md cursor-pointer hover:text-primary-color '>About</li>
                        <li className='p-4 rounded-md cursor-pointer hover:text-primary-color '>Contact</li>
                    </ul>
                    <div className='flex items-center'>
                        <PiUserDuotone size={30} />
                    </div>
                    <div onClick={toggleMenu} className='block md:hidden'>
                        {!showMenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                    </div>
                </div>
                <div className={!showMenu ? 'fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'fixed left-[-100%]'}>
                    <div>
                    </div>
                    <ul className='uppercase p-4'>
                        <li className='p-4 border-b cursor-pointer  border-gray-600'>Home</li>
                        <li className='p-4 border-b cursor-pointer  border-gray-600'>Browse Topics</li>
                        <li className='p-4 border-b cursor-pointer  border-gray-600'>Blog</li>
                        <li className='p-4 border-b cursor-pointer  border-gray-600'>About</li>
                        <li className='p-4'>Contact</li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Nav;
