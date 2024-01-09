import React from 'react'

export const ComingSoon = () => {
  return (
    <div>
        <div className='p-4 py-12'>
                <div class=" mt-[80px] grid grid-flow-col grid-cols-2 items-center my-auto mx-auto max-w-[80%] bg-white font-amiri">
                    <div className='grid grid-flow-row'>
                        <h1 class="text-h1 text-[#333] font-semibold mb-6     text-center">..قريبا إن شاء الله</h1>
                        <p class="text-h5 text-[#333] font-semibold  text-center">سيتم إطلاق هذه الخدمة قريبا</p>
                        <img alt='' src={dots} className='w-[100px] mx-auto mt-0' />
                    </div>
                    <img alt='' src={coming} className='w-[300px] m-auto' />
                </div>
            </div>
    </div>
  )
}
