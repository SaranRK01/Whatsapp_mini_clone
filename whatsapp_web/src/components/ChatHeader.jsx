import React from 'react';

export default function ChatHeader({ chat }) {
  if (!chat) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-wa-header border-b border-wa-border/30">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full bg-wa-input object-cover"
          />
          {chat.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-wa-green rounded-full border-2 border-wa-header" />
          )}
        </div>

        {/* Name & Status */}
        <div>
          <h2 className="text-[16px] font-medium text-wa-text leading-tight">{chat.name}</h2>
          <p className="text-xs text-wa-text-muted mt-0.5">
            {chat.isTyping ? (
              <span className="text-wa-green">typing...</span>
            ) : chat.online ? (
              'online'
            ) : (
              'last seen recently'
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors" title="Search">
          <svg className="w-5 h-5 text-wa-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="p-2 rounded-full hover:bg-wa-sidebar-hover transition-colors" title="Menu">
          <svg className="w-5 h-5 text-wa-text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
