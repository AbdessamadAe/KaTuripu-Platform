import React, { useState, useEffect } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

// You'll need to import the logo image properly in Next.js
// import logo from '../images/Logo.png'

const Nav: React.FC = () => {
    const [showMenu, setShowMenu] = useState<boolean>(true)
    const [navColorChanged, setNavColorChanged] = useState<boolean>(false);

    const toggleMenu = (): void => {
        setShowMenu(!showMenu)
    }

    const changeNavColor = (): void => {
        if (window.scrollY >= 40) {
            setNavColorChanged(true);
        } else {
            setNavColorChanged(false);
        }
    }
    
    useEffect(() => {
        window.addEventListener('scroll', changeNavColor);
        
        // Cleanup function
        return () => {
            window.removeEventListener('scroll', changeNavColor);
        };
    }, []);

    return (
        <div>
            <nav className={`top-0 fixed z-10 text-black w-full font-amiri text-menu flex justify-between items-center h-20 mx-auto px-4 pt-8 pb-8 uppercase ${!navColorChanged ? 'bg-transparent' : 'shadow-sm  bg-white'}`}>
                <div className='container flex justify-between items-center px-4 sm:px-14 '>
                    <img src="/images/Logo.png" alt="logo" onClick={() => window.location.href = `/`} className=' cursor-pointer w-[143px] h-auto' />
                    <div className='hidden md:flex items-center space-x-8 text-[18px]'>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/'>الرئيسية</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/browse-topics'>تصفح المواضيع</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/book-session'>إحجز حصة</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/team'>فريقنا</a>
                        <a className='p-4 rounded-md cursor-pointer hover:text-primary-color ' href='/contact-us'>إتصل بنا</a>
                    </div>
                    <div className='flex items-center'>
                    </div>
                    <div onClick={toggleMenu} className='block md:hidden'>
                        {!showMenu ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
                    </div>
                </div>
                <div className={!showMenu ? 'fixed left-0 top-0 w-[70%] border-r h-full border-r-gray-900 bg-[#ffff] ease-in-out duration-500' : 'fixed left-[-100%]'}>
                    <div>
                        <img src="/images/Logo.png" alt="logo" onClick={() => window.location.href = `/`} className=' cursor-pointer m-auto mt-6 w-[143px] h-auto' />
                    </div>
                    <div className='uppercase p-4 flex flex-col text-right'>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/'>الرئيسية</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/browse-topics'>تصفح المواضيع</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/book-session'>إحجز حصة</a>
                        </div>
                        <div className='p-4 rounded-md cursor-pointer hover:text-primary-color border-b border-gray-600'>
                            <a className='' href='/team'>فريقنا</a>
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
