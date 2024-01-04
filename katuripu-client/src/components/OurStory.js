import React from 'react'
import Nav from './Nav'
import { Footer } from './Footer'
import team from '../images/team.PNG'
import purple_illust from '../images/purple_illust.svg'

export const OurStory = () => {
    return (
        <div>
            <Nav />
            <div className=' animate-slide-fade-in mt-[80px] p-8'>
                <div className='relative items-center mx-auto'>
                    <div className=' text-h1 font-amiri font-bold text-center'>..قصتنا</div>
                </div>
                <div className='mt-8 grid grid-flow-col grid-cols-2'>
                    <img alt='team' src={team} className='m-auto -rotate-3 w-[400px] rounded-xl  ' />
                    <div className='font-amiri mx-auto text-h5 text-right text-gray-600 mr-12'>نحن متخصصون في تقديم المحتوى التعليمي باللغات منخفضة الموارد باستخدام المرئيات التفاعلية. نحن نركز حاليًا على إنشاء محتوى رياضيات عبر جميع مستويات المناهج المدرسية المغربية، باستخدام اللغة الدارجة، لكننا نخطط للتوسع عبر مواضيع علمية أخرى ودعم المزيد من اللغات في المستقبل.</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
