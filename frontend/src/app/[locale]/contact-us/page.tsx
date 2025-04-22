import React from 'react'
import { useTranslations } from 'next-intl'

const ContactUs = () => {
  const t = useTranslations('contact-us')
  return (
    <div>
      <div className='flex flex-col sm:grid sm:grid-flow-col sm:grid-cols-2 items-center mt-8 sm:mt-[80px] sm:pt-0 sm:p-6'>
        <div className="relative my-auto mx-auto max-w-[80%] bg-transparent dark:bg-transparent font-amiri">
          <h1 className="text-3xl text-[#333] dark:text-white font-semibold text-center">{t('contact')}</h1>
          <form
            className="mt-8 space-y-4"
            action="https://formsubmit.co/ssamad.2r@gmail.com"
            method="POST"
          >
            <input
              type="text"
              name="name"
              placeholder={t('form.name')}
              required
              className="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-gray-800 text-sm outline-blue-500 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder={t('form.email')}
              required
              className="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-gray-800 text-sm outline-blue-500 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <input
              type="text"
              name="subject"
              placeholder={t('form.subject')}
              className="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-gray-800 text-sm outline-blue-500 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <textarea
              name="message"
              placeholder={t('form.message')}
              rows={6}
              required
              className="w-full rounded-md px-4 bg-gray-100 dark:bg-gray-800 text-sm pt-3 outline-blue-500 dark:text-gray-200 dark:placeholder-gray-400"
            ></textarea>
            <button
              type="submit"
              className="text-neutral-50 bg-[#A78BFA] hover:bg-blue-600 dark:bg-[#A78BFA] dark:hover:bg-blue-700 font-semibold rounded-md text-sm px-4 py-3 w-full"
            >
              {t('form.submit')}
            </button>
          </form>
        </div>
        <img
          src="/images/contact.svg"
          alt="Illustration de contact"
          className="hidden sm:block w-[450px] h-[450px] mx-auto"
        />
      </div>
    </div>
  )
}

export default ContactUs