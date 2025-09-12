import { AppContext } from '../context/Appcontext.jsx';
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';

function Login() {

  const navigate = useNavigate();
  const { backEndUrl, setIsLoggedIn, getUserData } = useContext(AppContext)

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmithandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(backEndUrl + '/api/auth/register', { name, email, password })
        if (data.userId) {
          toast.success('OTP sent to your email')
          navigate('/verify-account', { state: { userId: data.userId } })
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } else {
        const { data } = await axios.post(backEndUrl + '/api/auth/login', { email, password })
        if (data.message === 'Login successful') {
          setIsLoggedIn(true)
          await getUserData();
          navigate('/')
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="backdrop-blur-md bg-white/30 p-10 rounded-2xl shadow-2xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-3">
          {state === 'Sign Up' ? 'Create account' : 'Log in'}
        </h2>
        <p className="text-center text-sm mb-6 text-gray-600">
          {state === 'Sign Up' ? 'Create Your account' : 'Log in to your account!'}
        </p>

        <form onSubmit={onSubmithandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
              <img src={assets.person_icon} alt="" className="w-5 opacity-60" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
            <img src={assets.mail_icon} alt="" className="w-5 opacity-60" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
              type="email"
              placeholder="Email id"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
            <img src={assets.lock_icon} alt="" className="w-5 opacity-60" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className="mb-4 text-indigo-600 text-sm cursor-pointer hover:underline text-center"
          >
            Forgot Password?
          </p>

          <button
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            type="submit"
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className="text-gray-600 text-center text-xs mt-4">
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="text-indigo-600 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-600 text-center text-xs mt-4">
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="text-indigo-600 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
