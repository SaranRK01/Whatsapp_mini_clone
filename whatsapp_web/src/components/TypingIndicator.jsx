import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-1 animate-fade-in-up">
      <div className="bg-wa-incoming px-4 py-3 rounded-lg rounded-tl-none shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-wa-text-muted rounded-full animate-typing-dot typing-dot-1" />
          <span className="w-2 h-2 bg-wa-text-muted rounded-full animate-typing-dot typing-dot-2" />
          <span className="w-2 h-2 bg-wa-text-muted rounded-full animate-typing-dot typing-dot-3" />
        </div>
      </div>
    </div>
  );
}
