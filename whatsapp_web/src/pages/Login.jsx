import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#202c33] rounded-lg shadow-xl p-8 chat-bg-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-[#202c33]/90 z-0"></div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <svg className="w-16 h-16 text-[#00a884] mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.205.534 1.292.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.031 18.238c-1.416 0-2.736-.376-3.877-1.018l-4.341 1.14 1.159-4.23c-.707-1.17-1.118-2.536-1.118-4.001 0-4.225 3.424-7.65 7.649-7.65 4.226 0 7.651 3.425 7.652 7.649 0 4.226-3.426 7.65-7.65 7.651.013-.001.013-.001-4.474-11.54z"/>
            </svg>
            <h2 className="text-2xl font-bold text-[#e9edef]">WhatsApp Web Clone</h2>
            <p className="text-[#8696a0] mt-2 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#8696a0] mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                className="w-full bg-[#2a3942] text-[#e9edef] rounded px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#00a884] placeholder-[#8696a0]/50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8696a0] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="w-full bg-[#2a3942] text-[#e9edef] rounded px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#00a884] placeholder-[#8696a0]/50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00a884] text-white rounded font-medium py-2.5 hover:bg-[#008069] transition-colors disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#8696a0] text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#00a884] hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
