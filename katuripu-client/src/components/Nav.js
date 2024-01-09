import React, { useState } from 'react'
import logo from '../images/Logo.png'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'



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
            <nav className={!NavColorChanged ? 'top-0 fixed z-10 text-black w-full font-amiri text-menu flex justify-between items-center h-20 mx-auto px-4 pt-8 pb-8 uppercase bg-transparent'
                : 'top-0 fixed z-10 text-black w-full font-amiri  text-menu flex justify-between shadow-sm items-center h-20 mx-auto px-4 pt-8 pb-8 uppercase bg-white'}>
                <div className='container flex justify-between items-center pl-14 pr-14'>
                    <img src={logo} alt="logo" onClick={() => window.location.href = `/`} className=' cursor-pointer w-[143px] h-auto' />
                    <div className='hidden md:flex items-center space-x-8 text-[18px]'>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/'>الرئيسية</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/BrowseTopics'>تصفح المواضيع</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/book-session'>إحجز حصة</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/about-us'>عنّا</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/contact-us'>إتصل بنا</a>
                    </div>
                    <div className='flex items-center'>
                        {/* <PiUserDuotone size={30} /> */}
                    </div>
                    <div onClick={toggleMenu} className='block md:hidden'>
                        {!showMenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                    </div>
                </div>
                <div className={!showMenu ? 'fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#ffff] ease-in-out duration-500' : 'fixed left-[-100%]'}>
                    <div>
                        <img src={logo} alt="logo" onClick={() => window.location.href = `/`} className=' cursor-pointer m-auto mt-6 w-[143px] h-auto' />
                    </div>
                    <div className='uppercase p-4 flex flex-col text-right'>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/'>الرئيسية</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/BrowseTopics'>تصفح المواضيع</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/book-session'>إحجز حصة</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/about-us'>عنّا</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/contact-us'>إتصل بنا</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav;
