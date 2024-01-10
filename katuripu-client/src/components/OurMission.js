import React from 'react'
import screenshot from '../images/screenshot.PNG'

export const OurMission = () => {
    return (
        <div id='mission' className='sm:pt-[80px] sm:mt-[-80px]'>
        <div className='bg-meteor-bg w-full bg-opacity-10 bg-center-bottom bg-no-repeat bg-cover h-fit py-auto sm:pb-6 '>
            <div className='items-center mx-auto'>
                <div className='text-h1 font-amiri font-bold text-center bg-purple-text-bg w-fit m-auto bg-no-repeat bg-center bg-cover px-10 '>..هدفنا</div>
            </div>
            <div className='mt-12 sm:mt-16 flex flex-col-reverse sm:grid sm:grid-flow-col sm:grid-cols-2 mx-8 sm:mx-12'>
                <img alt='team' src={screenshot} className='m-auto -rotate-3 border-[1px] sm:mt-auto mt-12 border-[#A78BFA] w-[90%] rounded-3xl  ' />
                <div>
                    <div dir='rtl' className='font-amiri leading-10 mx-auto text-[17px] sm:text-h5 text-gray-700'>نسعى لتوفير المحتوى التعليمي باللغات منخفضة الموارد باستخدام المرئيات التفاعلية. نركز حاليًا على إنشاء محتوى الرياضيات عبر جميع مستويات المناهج المدرسية المغربية، باستخدام اللغة الدارجة، لكننا نخطط للتوسع عبر مواضيع علمية أخرى ودعم المزيد من اللغات في المستقبل بإذن الله...</div>
                </div>
            </div>
        </div>
        </div>
    )
}
