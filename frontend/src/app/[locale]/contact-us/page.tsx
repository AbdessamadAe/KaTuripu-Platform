import React from 'react'
import { useTranslations } from 'next-intl'

const ContactUs = () => {
  const t = useTranslations('contact-us')
  return (
    <div className=" bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-200px)] py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:grid sm:grid-flow-col sm:grid-cols-2 items-center gap-8 lg:gap-12">
          <div className="w-full max-w-md mx-auto bg-transparent dark:bg-transparent font-amiri">
            <h1 className="text-3xl sm:text-4xl text-[#333] dark:text-white font-semibold text-center mb-6">{t('contact')}</h1>
            <form
              className="mt-8 space-y-5"
              action="https://formsubmit.co/ssamad.2r@gmail.com"
              method="POST"
            >
              <input
                type="text"
                name="name"
                placeholder={t('form.name')}
                required
                className="w-full rounded-lg py-3 px-4 bg-gray-100 dark:bg-gray-800 text-sm outline-blue-500 dark:text-gray-200 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
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
          
          <div className="hidden sm:flex justify-center items-center">
            <img
              src="/images/contact.svg"
              alt="Illustration de contact"
              className="w-full max-w-sm h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs