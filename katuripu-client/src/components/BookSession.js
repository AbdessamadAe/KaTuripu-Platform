import React from 'react'
import Nav from './Nav'
import { Footer } from './Footer'
import { Calendly } from './Calendly'
import illust from '../images/purple_illust.svg'


export const BookSession = () => {
    return (
        <div>
            < Nav />
            <div className='animate-slide-fade-in p-4 pt-20 pb-0'>
                <div class=" relative mt-[80px] grid grid-flow-col grid-cols-1 items-center my-auto mx-auto max-w-[80%] bg-white font-amiri">
                <img src={illust} className='absolute -top-20 right-10 w-[130px]'/> 
                    <div className='grid grid-flow-row text-center'>
                        <div className='space-y-3' id="booking-section" dir="rtl" lang="ar" >
                            <div className="text-h2 bg-purple-text-bg w-fit m-auto bg-no-repeat bg-center bg-cover px-8   ">
                                إحجز حصة الآن
                            </div>
                            <div className='px-24'>
                                <p className='text-h6'>انضم إلينا للحصول على دروس تقوية أو استشارات متخصصة في الرياضيات وعلوم الحاسوب. خبراؤنا مستعدون لمساعدتك في مواجهة أي تحدي، كبيرًا كان أم صغيرًا.</p>
                            </div>
                            <div>
                                <p className='text-h6'>ثمن الحصة: 50DH</p>
                                <p className='my-4 text-h6'>احجز الآن لتأمين مكانك واتخذ الخطوة التالية في رحلتك الأكاديمية!</p>
                                <button onClick={() => { window.location.href = '#booking-form' }} class=" my-3 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 bg-[#7C3AED] w-fit items-center hover:bg-primary-color text-white py-[8px] px-[40px] rounded-full">
                                    احجز الآن
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                
            </div>
            <Calendly />
            <Footer />
        </div>
    )
}
