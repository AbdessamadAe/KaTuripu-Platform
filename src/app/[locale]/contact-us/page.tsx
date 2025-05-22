'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Card, Input, Textarea, Button } from '@/components/ui'

const ContactUs = () => {
  const t = useTranslations('contact-us')
  return (
    <div className="bg-gradient-to-b from-white to-[#f5f3ff] dark:from-gray-900 dark:to-indigo-950/30 min-h-[calc(100vh-200px)] py-12 lg:py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#a7d1cf]/30 dark:bg-[#a7d1cf]/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#f0b9ae]/20 dark:bg-[#f0b9ae]/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:grid sm:grid-flow-col sm:grid-cols-2 items-center gap-8 lg:gap-12">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white font-bold text-center mb-6">
              <span className="relative">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7d9bbf] to-[#f0b9ae] blur-lg opacity-30"></span>
                <span className="relative">{t('contact')}</span>
              </span>
            </h1>
            
            <Card 
              variant="elevated" 
              className="mt-8 relative"
              hoverEffect={false}
            >
              <form
                className="space-y-5 p-6 md:p-8"
                action="https://formsubmit.co/ssamad.2r@gmail.com"
                method="POST"
              >
                {/* Decorative elements */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#a7d1cf]/30 dark:bg-[#a7d1cf]/15 rounded-full blur-xl -z-10"></div>
                <div className="absolute -left-4 -top-4 w-20 h-20 bg-[#f0b9ae]/30 dark:bg-[#f0b9ae]/15 rounded-full blur-xl -z-10"></div>
              
              <Input
                type="text"
                name="name"
                placeholder={t('form.name')}
                required
                variant="filled"
                fullWidth
                size="md"
                className="bg-[#f7f7fe] dark:bg-gray-700"
              />
              
              <Input
                type="email"
                name="email"
                placeholder={t('form.email')}
                required
                variant="filled"
                fullWidth
                size="md"
                className="bg-[#f7f7fe] dark:bg-gray-700"
              />
              
              <Input
                type="text"
                name="subject"
                placeholder={t('form.subject')}
                variant="filled"
                fullWidth
                size="md"
                className="bg-[#f7f7fe] dark:bg-gray-700"
              />
              
              <Textarea
                name="message"
                placeholder={t('form.message')}
                rows={6}
                required
                variant="filled"
                fullWidth
                className="bg-[#f7f7fe] dark:bg-gray-700 resize-none"
              />
              
              <Button
                type="submit"
                isFullWidth
                size="lg"
              >
                {t('form.submit')}
              </Button>
              </form>
            </Card>
          </div>
          
          <div className="hidden sm:flex  justify-center items-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -z-10 w-40 h-40 bg-[#a7d1cf]/40 dark:bg-[#a7d1cf]/20 rounded-full blur-3xl top-1/4 left-1/4 opacity-70"></div>
              <div className="absolute -z-10 w-32 h-32 bg-[#f0b9ae]/40 dark:bg-[#f0b9ae]/20 rounded-full blur-3xl bottom-1/3 right-1/4 opacity-70"></div>
              
              <img
                src="/images/contact.svg"
                alt="Illustration de contact"
                className="w-full max-w-sm h-auto object-contain drop-shadow-xl dark:filter dark:brightness-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs