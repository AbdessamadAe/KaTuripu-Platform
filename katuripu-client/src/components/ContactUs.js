import React from 'react'
import Nav from './Nav'
import { Footer } from './Footer'
import contact from '../images/contact.svg'

export const ContactUs = () => {
  return (
    <div>
      <Nav />
      <div className=' animate-slide-fade-in grid grid-flow-col grid-cols-2 items-center mt-[80px] p-6'>
        <div class="relative my-auto mx-auto max-w-[80%] bg-white font-amiri">
          <h1 class="text-3xl text-[#333] font-semibold  text-center">تواصل معنا</h1>
          <form class="mt-8 space-y-4" action="https://formsubmit.co/ssamad.2r@gmail.com" method="POST">
            <input type='text' placeholder='Name'
              class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500" />
            <input type='email' placeholder='Email'
              class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500" />
            <input type='text' placeholder='Subject'
              class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500" />
            <textarea placeholder='Message' rows="6"
              class="w-full rounded-md px-4 bg-gray-100 text-sm pt-3 outline-blue-500"></textarea>
            <button type="submit" 
              class="text-neutral-50  bg-[#A78BFA] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-3 w-full">Send</button>
          </form>
        </div>
        <img src={contact} alt="" className='w-[450px] h-[450px] mx-auto' />
      </div>
      <Footer/>
    </div>
  )
}
