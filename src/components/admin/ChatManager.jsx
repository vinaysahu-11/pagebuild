import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Send, User, CreditCard, X } from 'lucide-react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebase';
const ChatManager = () => {
  const { chats, addChat } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [users, setUsers] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentService, setPaymentService] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('INR');
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

  const handleSendPaymentRequest = (e) => {
    e.preventDefault();
    if (paymentAmount && paymentService) {
      addChat(`Payment Request: ${paymentCurrency} ${paymentAmount} for ${paymentService}`, 'admin', 'payment_request', {
        amount: parseFloat(paymentAmount),
        currency: paymentCurrency,
        service: paymentService,
        status: 'pending',
        paymentId: 'mock_payment_' + Date.now(), // Generate a unique ID for the frontend tracking
      });
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentService('');
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
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="btn"
            style={{
              background: 'var(--success)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {showPaymentForm ? <X size={18} /> : <CreditCard size={18} />}
            {showPaymentForm ? 'Cancel' : 'Request Payment'}
          </button>
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
                  chat.type === 'payment_request' ? 'var(--glass-bg)' :
                  chat.sender === 'admin'
                    ? 'var(--primary-color)'
                    : 'var(--glass-bg)',
                color:
                  chat.type === 'payment_request' ? 'var(--text-primary)' :
                  chat.sender === 'admin' ? 'white' : 'var(--text-primary)',
                border:
                  chat.type === 'payment_request' ? '2px solid var(--success)' :
                  chat.sender === 'admin'
                    ? 'none'
                    : '1px solid var(--glass-border)',
              }}
            >
              {chat.type === 'payment_request' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <strong>Payment Request</strong>
                  <span>{chat.service}</span>
                  <h3 style={{ margin: '0.5rem 0', color: 'var(--success)' }}>
                    {chat.currency === 'INR' ? '₹' : '$'}{chat.amount}
                  </h3>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    background: chat.status === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    color: chat.status === 'success' ? '#4ade80' : '#facc15',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {chat.status === 'success' ? 'PAID' : 'PENDING'}
                  </div>
                </div>
              ) : (
                chat.text
              )}
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

        {showPaymentForm && (
          <form 
            onSubmit={handleSendPaymentRequest}
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--glass-border)',
              background: 'rgba(0,0,0,0.1)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Service Name"
              value={paymentService}
              onChange={(e) => setPaymentService(e.target.value)}
              required
              style={{
                flex: 2,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
            <select
              value={paymentCurrency}
              onChange={(e) => setPaymentCurrency(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                outline: 'none',
              }}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--success)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Send Request
            </button>
          </form>
        )}

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
