import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-purple-500/50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50"
      aria-label="Open Chat"
    >
      <MessageSquare size={32} />
    </button>
  );
};

export default ChatButton;
