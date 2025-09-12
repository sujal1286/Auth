import { AppContext } from '../context/Appcontext.jsx'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Header from '../components/Header'

function Home() {
  const { userData } = useContext(AppContext)

  return (
    <div className='relative flex flex-col items-center min-h-screen 
      bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'>
      
      <NavBar />
      <Header />
    </div>
  )
}

export default Home
