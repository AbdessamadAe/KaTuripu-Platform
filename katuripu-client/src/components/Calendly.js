import React from 'react'
import {InlineWidget} from 'react-calendly'



export const Calendly = () => {
    return (
        <div id='booking-form'  className='py-4 h-full mb-[10px]'>
            <InlineWidget styles={
                {
                    height: '660px'
                }
            }  url="https://calendly.com/ssamad-2r/30min"/>
        </div>
    )
}