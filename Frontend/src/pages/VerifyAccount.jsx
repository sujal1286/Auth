import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyAccount() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backEndUrl + '/api/auth/verify-account', { userId, otp });
      if (data.message === 'User registered successfully') {
        toast.success('Account verified! You can now login.');
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to verify account');
    }
    setLoading(false);
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 auth-bg">
        <div className="auth-card text-center">
          <h2 className="text-3xl font-semibold text-white mb-3">Verification Error</h2>
          <p className="mb-6">No user ID found. Please register first.</p>
          <button onClick={() => navigate('/login')} className="primary-btn">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 auth-bg">
      <div className="auth-card">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Verify Your Account</h2>
        <p className="text-center text-sm mb-6">Enter the OTP sent to your email to complete registration.</p>
        <form onSubmit={handleVerify}>
          <div className="mb-4 input-field">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setOtp(e.target.value)}
              value={otp}
              className="bg-transparent outline-none w-full placeholder-gray-400"
              type="text"
              placeholder="Enter OTP"
              required
            />
          </div>
          <button disabled={loading} className="primary-btn">
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyAccount;
