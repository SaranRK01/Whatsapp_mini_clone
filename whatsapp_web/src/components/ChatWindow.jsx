import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

export default function ChatWindow() {
  const messagesEndRef = useRef(null);
  const { activeChat, sendMessage } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChat?.isTyping]);

  // Empty state
  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-wa-panel">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-[260px] h-[260px] mx-auto mb-6 flex items-center justify-center">
            <svg className="w-48 h-48 text-wa-border/40" viewBox="0 0 303 172" fill="currentColor">
              <path d="M229.565 160.229c-1.167.913-24.982 20.112-75.694 20.112-65.273 0-118.266-52.993-118.266-118.266 0-65.273 52.993-118.266 118.266-118.266 65.273 0 118.265 52.993 118.265 118.266 0 30.6-11.675 58.478-30.802 79.49l7.636 31.446-19.405-12.782zm-25.74-44.065l-4.395-7.442s-7.603-3.485-16.482-4.018c-1.378-.083-3.379.37-5.553 1.357-4.249 1.933-7.118 5.658-8.312 7.191-.272.349-.748.452-1.14.249-5.104-2.632-18.174-11.204-25.935-24.108-.216-.36-.166-.817.139-1.112 2.243-2.169 5.196-5.986 5.907-8.347.38-1.263.353-3.39-.139-6.208-.67-3.836-3.95-11.582-5.66-15.278-.482-1.041-1.327-1.734-2.298-2.033-2.086-.643-5.865-1.102-8.487.133-5.394 2.544-11.138 9.398-11.987 17.236-.129 1.196-.078 2.4.077 3.592.605 4.651 2.838 9.768 6.397 14.961 6.878 10.032 18.396 22.344 36.744 30.624 6.225 2.81 11.377 3.93 15.498 4.36 5.157.538 9.134-.384 11.482-1.18 5.253-1.782 11.227-6.466 13.296-12.27.553-1.551.678-2.964.46-4.122-.415-2.2-3.173-3.443-5.61-4.805z" opacity=".08"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-light text-wa-text mb-3">WhatsApp Web</h1>
          <p className="text-sm text-wa-text-muted leading-relaxed max-w-sm mx-auto">
            Send and receive messages without keeping your phone online.
            <br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-wa-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <ChatHeader chat={activeChat} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-16 py-4 chat-bg-pattern">
        <div className="max-w-3xl mx-auto space-y-0.5">
          {/* Date separator */}
          <div className="flex justify-center mb-6 mt-2">
            <span className="bg-wa-incoming text-wa-text-muted text-[12.5px] px-3 py-1 rounded-lg shadow-sm">
              Today
            </span>
          </div>

          {activeChat.messages?.map((msg) => {
             // Map backend format to frontend UI format
             const isSent = msg.sender._id === user._id || msg.sender === user._id; // handle populated vs non-populated
             const formattedMessage = {
               id: msg._id,
               text: msg.message,
               time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               type: isSent ? 'sent' : 'received'
             };
             
             return <MessageBubble key={msg._id} message={formattedMessage} />;
          })}

          {activeChat.isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
