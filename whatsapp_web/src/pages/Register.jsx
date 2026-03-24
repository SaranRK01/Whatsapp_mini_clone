import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#202c33] rounded-lg shadow-xl p-8 chat-bg-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-[#202c33]/90 z-0"></div>
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#e9edef]">Create an Account</h2>
            <p className="text-[#8696a0] mt-1 text-sm">Join WhatsApp Web Clone</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#8696a0] mb-1">Username *</label>
              <input
                type="text"
                required
                minLength="3"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                className="w-full bg-[#2a3942] text-[#e9edef] rounded px-4 py-2 outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8696a0] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                className="w-full bg-[#2a3942] text-[#e9edef] rounded px-4 py-2 outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8696a0] mb-1">Password *</label>
              <input
                type="password"
                required
                minLength="6"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="w-full bg-[#2a3942] text-[#e9edef] rounded px-4 py-2 outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00a884] text-white rounded font-medium py-2 hover:bg-[#008069] transition-colors disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-5 text-center text-[#8696a0] text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#00a884] hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
