import { AppContext } from '../context/Appcontext.jsx'
import React, { useContext } from 'react'
import { assets } from '../assets/assets'

function Header() {
  const { userData } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center justify-center text-center mt-16 px-4'>
      <img src={assets.header_img} alt=""
        className='w-36 h-36 rounded-full mb-6 shadow-lg'
      />

      <h1 className='flex items-center gap-2 text-2xl sm:text-4xl font-semibold mb-2 text-gray-800'>
        Hey {userData ? userData.name : "developer"}!
        <img className='w-8 h-8' src={assets.hand_wave} alt="" />
      </h1>

      <h2 className='text-4xl sm:text-6xl font-extrabold mb-4 
        bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>
        Welcome to our app
      </h2>

      <p className='mb-8 max-w-md text-gray-600'>
        Let's start with a quick product tour and we will have you up and running in no time.
      </p>

      <button className='px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 transition-transform'>
        Get Started
      </button>
    </div>
  )
}

export default Header
