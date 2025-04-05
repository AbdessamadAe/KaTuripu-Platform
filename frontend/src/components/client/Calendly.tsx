import React from 'react'
import { InlineWidget } from 'react-calendly'

interface CalendlyWidgetStyles {
    height: string;
    [key: string]: string;
}

export const Calendly: React.FC = () => {
    const styles: CalendlyWidgetStyles = {
        height: '660px'
    };

    return (
        <div id='booking-form' className='py-4 h-full mb-[10px]'>
            <InlineWidget 
                styles={styles} 
                url="https://calendly.com/ssamad-2r/30min"
            />
        </div>
    )
}

export default Calendly;
