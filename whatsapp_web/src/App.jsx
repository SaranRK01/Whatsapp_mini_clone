import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';
import useChatStore from './store/chatStore';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-wa-dark">
        <svg className="w-12 h-12 text-wa-green animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Chat Layout
const ChatLayout = () => {
  const { connectSocket, disconnectSocket, fetchChats } = useChatStore();

  useEffect(() => {
    connectSocket();
    fetchChats();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, fetchChats]);

  return (
    <div className="flex w-full h-full max-w-[1600px] bg-wa-dark shadow-2xl overflow-hidden relative">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
