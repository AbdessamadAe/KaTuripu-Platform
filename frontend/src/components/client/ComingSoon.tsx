import React from 'react'
// Make sure to have these images in your project or update the paths
// import dots from '../images/dots.svg'
// import coming from '../images/coming.svg'

export const ComingSoon: React.FC = () => {
  return (
    <div>
        <div className='p-4 py-12'>
            <div className="mt-[80px] grid grid-flow-col grid-cols-2 items-center my-auto mx-auto max-w-[80%] bg-white font-amiri">
                <div className='grid grid-flow-row'>
                    <h1 className="text-h1 text-[#333] font-semibold mb-6 text-center">..قريبا إن شاء الله</h1>
                    <p className="text-h5 text-[#333] font-semibold text-center">سيتم إطلاق هذه الخدمة قريبا</p>
                    <img alt='' src="/images/dots.svg" className='w-[100px] mx-auto mt-0' />
                </div>
                <img alt='' src="/images/coming.svg" className='w-[300px] m-auto' />
            </div>
        </div>
    </div>
  )
}

export default ComingSoon;
