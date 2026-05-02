import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Send, User } from 'lucide-react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebase';
const ChatManager = () => {
  const { chats, addChat } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const db = getFirestore(app);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chats]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const userList = [];
        snapshot.forEach((doc) => {
          userList.push(doc.data());
        });
        userList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(userList);
      },
      (error) => {
        console.error('Error fetching users: ', error);
      }
    );
    return () => unsubscribe();
  }, []);
  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addChat(inputText, 'admin');
      setInputText('');
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 8rem)',
        gap: '1.5rem',
      }}
    >
      {}
      <div
        className="glass-panel"
        style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
            }}
          >
            Active Chats
          </h3>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {users.length === 0 && (
            <div
              style={{
                padding: '1.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              No active users yet.
            </div>
          )}
          {users.map((user) => (
            <div
              key={user.uid}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <User size={20} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: '600',
                  }}
                >
                  {user.name || 'User'}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div
        className="glass-panel"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <User size={20} />
          </div>
          <div>
            <div
              style={{
                fontWeight: '600',
              }}
            >
              Website Visitor
            </div>
          </div>
        </div>

        <div
          className="chat-messages"
          style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`message ${chat.sender}`}
              style={{
                maxWidth: '70%',
                padding: '1rem',
                borderRadius: '12px',
                alignSelf: chat.sender === 'admin' ? 'flex-end' : 'flex-start',
                background:
                  chat.sender === 'admin'
                    ? 'var(--primary-color)'
                    : 'var(--glass-bg)',
                color:
                  chat.sender === 'admin' ? 'white' : 'var(--text-primary)',
                border:
                  chat.sender === 'admin'
                    ? 'none'
                    : '1px solid var(--glass-border)',
              }}
            >
              {chat.text}
              <div
                style={{
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  opacity: 0.7,
                  textAlign: chat.sender === 'admin' ? 'right' : 'left',
                }}
              >
                {new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            gap: '1rem',
          }}
        >
          <input
            type="text"
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              outline: 'none',
            }}
            placeholder="Type your reply..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '0 1.5rem',
              borderRadius: '8px',
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChatManager;
