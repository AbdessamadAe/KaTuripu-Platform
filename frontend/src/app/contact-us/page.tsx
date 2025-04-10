// pages/contact.tsx
import React from 'react'
import { Footer } from '@/components/client/Footer'

const ContactUs = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid sm:grid-flow-col sm:grid-cols-2 items-center mt-28 sm:mt-[80px] sm:pt-0 sm:p-6'>
        <div className="relative my-auto mx-auto max-w-[80%] bg-transparent font-amiri">
          <h1 className="text-3xl text-[#333] font-semibold text-center">تواصل معنا</h1>
          <form
            className="mt-8 space-y-4"
            action="https://formsubmit.co/ssamad.2r@gmail.com"
            method="POST"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-blue-500"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={6}
              required
              className="w-full rounded-md px-4 bg-gray-100 text-sm pt-3 outline-blue-500"
            ></textarea>
            <button
              type="submit"
              className="text-neutral-50 bg-[#A78BFA] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-3 w-full"
            >
              Send
            </button>
          </form>
        </div>
        <img
          src="/images/contact.svg"
          alt="Contact illustration"
          className="hidden sm:block w-[450px] h-[450px] mx-auto"
        />
      </div>
      <Footer />
    </div>
  )
}

export default ContactUs