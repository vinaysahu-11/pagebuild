import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { chats, addChat } = useAppContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chats, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addChat(inputText, 'user');
      setInputText('');
    }
  };

  return (
    <>
      <button className="chat-widget-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div style={{ fontWeight: '600' }}>Chat with us</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>We usually reply instantly</div>
          </div>
          
          <div className="chat-messages">
            {chats.map((chat) => (
              <div key={chat.id} className={`message ${chat.sender}`}>
                {chat.text}
                <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: chat.sender === 'user' ? 'right' : 'left' }}>
                  {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type your message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
