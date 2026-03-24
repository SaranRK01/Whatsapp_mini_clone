import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { chats, activeChat, selectChat, searchUsers } = useChatStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        // Filter out current user from search results
        setSearchResults(results.filter(u => u._id !== user._id));
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers, user._id]);

  const displayList = isSearching ? searchResults.map(u => ({
    id: u._id,
    name: u.username,
    avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
    lastMessage: 'Tap to start chatting',
    time: '',
    unread: 0,
    online: u.isOnline,
    isTyping: false
  })) : chats;

  const filteredDisplayList = displayList.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChatClick = async () => {
    setIsSearching(true);
    setSearchQuery('');
    const results = await searchUsers('');
    setSearchResults(results.filter(u => u._id !== user._id));
    setTimeout(() => {
      document.getElementById('chat-search')?.focus();
    }, 10);
  };

  return (
    <div className="w-[420px] min-w-[320px] h-full flex flex-col bg-wa-sidebar border-r border-wa-border/40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-wa-header">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover bg-wa-input"
          />
          <span className="text-wa-text font-semibold text-lg tracking-tight">{user?.username}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* New chat icon */}
          <button 
            onClick={handleNewChatClick}
            className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors" 
            title="New Chat"
          >
            <svg className="w-5 h-5 text-wa-text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </button>
          {/* Logout icon */}
          <button 
            onClick={logout}
            className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors" 
            title="Logout"
          >
            <svg className="w-5 h-5 text-wa-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 bg-wa-sidebar">
        <div className="flex items-center bg-wa-search rounded-lg px-4 py-1.5 gap-3">
          <svg className="w-4 h-4 text-wa-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="chat-search"
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-wa-text placeholder-wa-text-muted outline-none py-1"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDisplayList.length > 0 ? (
          filteredDisplayList.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => {
                selectChat(chat);
                setSearchQuery(''); // Clear search after selection
                setIsSearching(false);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-wa-text-muted">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <p className="text-sm">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}
