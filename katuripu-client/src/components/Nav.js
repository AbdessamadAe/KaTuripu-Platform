import React, { useState } from 'react'
import logo from '../images/Logo.png'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

const Nav = () => {
    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    return (
        <div>
            <nav className=' text-white pr-12 pl-12 flex justify-between items-center h-20 mx-auto px-4'>
                <div>
                    <img src={logo} alt="logo" width="15%"/>
                </div>
                <ul className='hidden md:flex'>
                    <li className='p-4'>Home</li>
                    <li className='p-4 flex items-center justify-between'>
                        <span className='px-1'>Browse</span>
                        <span className='px-1'>Topics</span>
                    </li>
                    <li className='p-4'>Blog</li>
                    <li className='p-4'>About</li>
                    <li className='p-4'>Contact</li>
                </ul>
                <div onClick={toggleMenu} className='block md:hidden'>
                    {!showMenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </div>
                <div className={!showMenu ? 'fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'fixed left-[-100%]'}>
                    <div>
                    </div>
                    <ul className='uppercase p-4'>
                        <li className='p-4 border-b border-gray-600'>Home</li>
                        <li className='p-4 border-b border-gray-600'>Topics</li>
                        <li className='p-4 border-b border-gray-600'>Blog</li>
                        <li className='p-4 border-b border-gray-600'>About</li>
                        <li className='p-4'>Contact</li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Nav;
