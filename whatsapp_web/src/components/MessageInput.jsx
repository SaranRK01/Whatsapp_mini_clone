import React, { useState, useEffect } from 'react';
import useChatStore from '../store/chatStore';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const { emitTyping } = useChatStore();

  useEffect(() => {
    let typingTimer;
    if (message) {
      emitTyping(true);
      typingTimer = setTimeout(() => {
        emitTyping(false);
      }, 2000);
    } else {
      emitTyping(false);
    }
    
    return () => clearTimeout(typingTimer);
  }, [message, emitTyping]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      emitTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-wa-header border-t border-wa-border/30">
      {/* Emoji Button */}
      <button className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors flex-shrink-0" title="Emoji">
        <svg className="w-6 h-6 text-wa-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      </button>

      {/* Attachment Button */}
      <button className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors flex-shrink-0" title="Attach">
        <svg className="w-6 h-6 text-wa-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      </button>

      {/* Input */}
      <div className="flex-1">
        <input
          id="message-input"
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-wa-input text-wa-text placeholder-wa-text-muted rounded-lg px-4 py-2.5 text-[15px] outline-none focus:ring-1 focus:ring-wa-green/30 transition-all"
        />
      </div>

      {/* Send / Mic Button */}
      {message.trim() ? (
        <button
          id="send-button"
          onClick={handleSend}
          className="p-2 rounded-full bg-wa-green hover:bg-wa-green-dark transition-colors flex-shrink-0"
          title="Send"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      ) : (
        <button className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors flex-shrink-0" title="Voice message">
          <svg className="w-6 h-6 text-wa-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
      )}
    </div>
  );
}
