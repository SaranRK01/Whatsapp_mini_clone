import React from 'react';

export default function ChatItem({ chat, isActive, onClick }) {
  return (
    <div
      id={`chat-item-${chat.id}`}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-200 border-b border-wa-border/30 group
        ${isActive ? 'bg-wa-sidebar-hover' : 'hover:bg-wa-sidebar-hover/60'}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full bg-wa-input object-cover"
        />
        {chat.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-wa-green rounded-full border-2 border-wa-sidebar" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-wa-text truncate">
            {chat.name}
          </h3>
          <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? 'text-wa-green' : 'text-wa-text-muted'}`}>
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[13px] text-wa-text-secondary truncate pr-2">
            {chat.isTyping ? (
              <span className="text-wa-green italic">typing...</span>
            ) : (
              chat.lastMessage
            )}
          </p>
          {chat.unread > 0 && (
            <span className="flex-shrink-0 bg-wa-unread-bg text-wa-dark text-[11px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
