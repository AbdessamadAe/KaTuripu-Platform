import React from 'react'
import Nav from './Nav'
import Hero from './Hero'
import { BrowseTopics } from './BrowseTopics'

export const Home = () => {
  return (
    <div className=' h-[800px]'>
        <Nav />
        <Hero />
        <BrowseTopics/>
    </div>
  )
}