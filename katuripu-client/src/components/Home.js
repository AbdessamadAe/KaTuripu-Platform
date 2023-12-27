import React from 'react'
import Nav from './Nav'
import Hero from './Hero'
import { BrowseTopics } from './BrowseTopics'

export const Home = () => {
  return (
    <div className=''>
        <Nav />
        <Hero />
        <BrowseTopics/>
    </div>
  )
}