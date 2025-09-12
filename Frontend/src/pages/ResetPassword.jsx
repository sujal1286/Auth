import { AppContext } from '../context/Appcontext.jsx';
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const { backEndUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const { data } = await axios.post(backEndUrl + '/api/auth/send-reset-otp', { email });
      toast.success(data.message || 'OTP sent');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) return toast.error('All fields are required');
    setLoading(true);
    try {
      const { data } = await axios.post(backEndUrl + '/api/auth/reset-password', { email, otp, newPassword });
      toast.success(data.message || 'Password reset successful');
      setStep(1);
      setEmail(''); setOtp(''); setNewPassword('');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="backdrop-blur-md bg-white/30 p-10 rounded-2xl shadow-2xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-3">Reset Password</h2>
        <p className="text-center text-sm mb-6 text-gray-600">
          Enter your account email to receive an OTP, then set a new password.
        </p>

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
              <img src={assets.mail_icon} alt="" className="w-5 opacity-60" />
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                type="email"
                placeholder="Email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={reset} className="space-y-4">
            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
              <img src={assets.mail_icon} alt="" className="w-5 opacity-60" />
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                type="email"
                placeholder="Email address"
                required
              />
            </div>

            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
              <img src={assets.lock_icon} alt="" className="w-5 opacity-60" />
              <input
                onChange={e => setOtp(e.target.value)}
                value={otp}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                type="text"
                placeholder="OTP"
                required
              />
            </div>

            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white/60 border border-white/70 shadow-sm">
              <img src={assets.lock_icon} alt="" className="w-5 opacity-60" />
              <input
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                type="password"
                placeholder="New password"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); }}
                className="flex-1 py-3 rounded-full bg-gray-200 text-gray-700 font-semibold shadow-sm hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword;
