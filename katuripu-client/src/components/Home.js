import React from 'react'
import Nav from './Nav'
import Hero from './Hero'
import { Footer } from './Footer'
import { OurMission } from './OurMission'

export const Home = () => {
  return (
    <div className=''>
        <Nav />
        <Hero />
        <OurMission />
        <Footer/>
    </div>
  )
}