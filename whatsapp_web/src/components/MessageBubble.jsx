import React from 'react';

export default function MessageBubble({ message }) {
  const isSent = message.type === 'sent';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1 animate-fade-in-up`}>
      <div
        className={`relative max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm
          ${isSent
            ? 'bg-wa-outgoing text-wa-text rounded-tr-none'
            : 'bg-wa-incoming text-wa-text rounded-tl-none'
          }`}
      >
        <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <div className={`flex items-center gap-1 mt-0.5 ${isSent ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[11px] text-wa-text-muted leading-none">{message.time}</span>
          {isSent && (
            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 16 15" fill="currentColor">
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.378.456a.32.32 0 0 0 .04.45l1.068.97c.14.127.347.118.476-.02l6.16-7.34a.366.366 0 0 0-.063-.51z" />
              <path d="M11.28 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.936 9.88a.32.32 0 0 1-.484.033L2.52 8.116a.365.365 0 0 0-.51.063l-.372.478a.365.365 0 0 0 .063.51l2.59 2.354c.14.127.347.118.476-.02l6.16-7.34a.366.366 0 0 0-.063-.51h-.084z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
