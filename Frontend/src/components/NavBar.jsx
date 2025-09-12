import { AppContext } from '../context/Appcontext.jsx';
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate();
  const { userData, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  return (
    <div className='w-full flex justify-between items-center px-6 sm:px-24 py-6'>
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 cursor-pointer" />
      
      <div className='flex items-center gap-4'>
        {userData ? (
          <div className='relative'>
            <button onClick={() => setOpen(!open)} 
              className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold'>
              {userData.name ? userData.name[0].toUpperCase() : 'U'}
            </button>
            {open && (
              <div className='absolute right-0 mt-3 p-4 w-52 rounded-lg shadow-lg bg-white text-gray-700'>
                <div className='font-semibold text-lg mb-1'>{userData.name}</div>
                <div className='text-sm mb-3'>
                  Status: {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
                </div>
                <button 
                  onClick={() => { logout(); setOpen(false); navigate('/'); }} 
                  className='w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm'>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:scale-105 transition-transform'>
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default NavBar
