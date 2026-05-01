import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Send, User } from 'lucide-react';

const ChatManager = () => {
  const { chats, addChat } = useAppContext();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addChat(inputText, 'admin');
      setInputText('');
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 8rem)', gap: '1.5rem' }}>
      {/* Active Chats List */}
      <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Active Chats</h3>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Mocking a single active chat for now based on context */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Website Visitor</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Online Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>Website Visitor</div>
          </div>
        </div>

        <div className="chat-messages" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {chats.map((chat) => (
            <div key={chat.id} className={`message ${chat.sender}`} style={{ 
              maxWidth: '70%', 
              padding: '1rem', 
              borderRadius: '12px',
              alignSelf: chat.sender === 'admin' ? 'flex-end' : 'flex-start',
              background: chat.sender === 'admin' ? 'var(--primary-color)' : 'var(--glass-bg)',
              color: chat.sender === 'admin' ? 'white' : 'var(--text-primary)',
              border: chat.sender === 'admin' ? 'none' : '1px solid var(--glass-border)'
            }}>
              {chat.text}
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7, textAlign: chat.sender === 'admin' ? 'right' : 'left' }}>
                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            style={{ 
              flex: 1, 
              background: 'rgba(0,0,0,0.2)', 
              border: '1px solid var(--glass-border)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px', 
              outline: 'none' 
            }} 
            placeholder="Type your reply..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '8px' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatManager;
