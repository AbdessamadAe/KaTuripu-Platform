import React from 'react'
import logo from '../images/Logo.png'

export const Nav = () => {
    return (
        <div>
            <nav className='pr-12 pl-12 bg-gradient-to-r from-custom-color1 to-purple-700 flex justify-between items-center h-20 mx-auto px-4'>
                <a className="" href="/">
                    <img src={logo} alt="logo" width="15%" height="15%" />
                </a>
                <ul className='flex'>
                    <li className='p-4'>Home</li>
                    <li className='p-4 flex items-center justify-between'>
                        <span className='px-1'>Browse</span>
                        <span className='px-1'>Topics</span>
                    </li>
                    <li className='p-4'>Blog</li>
                    <li className='p-4'>About</li>
                    <li className='p-4'>Contact</li>
                </ul>
            </nav>
        </div>
    )
}
