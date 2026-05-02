import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { forwardRef, useImperativeHandle } from 'react';

const ChatWidget = forwardRef((props, ref) => {
    // Expose open and setService methods to parent
    useImperativeHandle(ref, () => ({
      open: (service) => {
        setIsOpen(true);
        if (service) {
          setShowAuth(true);
          setAuthStep('service');
          setSelectedService(service);
        }
      }
    }));
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { chats, addChat, addClient } = useAppContext();
  const messagesEndRef = useRef(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authStep, setAuthStep] = useState('login'); // login | signup | service
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const services = ['Website', 'App', 'SEO', 'Marketing'];
  const auth = getAuth(app);
  const db = getFirestore(app);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chats, isOpen]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u && !selectedService) {
        setShowAuth(true);
        setAuthStep('service');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!user || !selectedService) {
      setShowAuth(true);
      setAuthStep(user ? 'service' : 'login');
      return;
    }
    if (inputText.trim()) {
      addChat(inputText, 'user');
      setInputText('');
    }
  };

  // Anonymous login with name and email only
  const handleAnonLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    try {
      const res = await signInAnonymously(auth);
      // Store user details in Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      // Add as a new lead in global clients list
      addClient({
        name,
        project: 'Pending Discussion',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 'TBD',
        status: 'New Lead',
        payment: 'Pending'
      });
      
      setShowAuth(true);
      setAuthStep('service');
    } catch (err) {
      setError('Signup failed. ' + (err.message || 'Try again.'));
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowAuth(false);
    // Optionally, send a chat message about the service
    if (service !== 'None') {
      addChat(`Selected service: ${service}`, 'user');
    }
  };

  // Allow global openChatWidget for Pricing button
  if (typeof window !== 'undefined') {
    window.openChatWidget = (service) => {
      setIsOpen(true);
      setShowAuth(true);
      setAuthStep('service');
      if (service) setSelectedService(service);
    };
  }

  return (
    <>
      <button className="chat-widget-btn" onClick={() => {
        setIsOpen(!isOpen);
        if (!user) {
          setShowAuth(true);
          setAuthStep('login');
        }
      }}>
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
              disabled={!user || !selectedService}
            />
            <button type="submit" className="chat-send-btn" disabled={!user || !selectedService}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Auth/Service Modal */}
      {showAuth && (
        <div className="chat-auth-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}>
            {(authStep === 'login' || authStep === 'signup') && (
              <>
                <h3 style={{ marginBottom: '1rem' }}>Continue to Chat</h3>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleAnonLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 600 }}>Continue</button>
                </form>
              </>
            )}
            {authStep === 'service' && (
              <>
                <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>What are you looking for?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {services.map(service => (
                    <button key={service} onClick={() => handleServiceSelect(service)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #6366f1', background: selectedService === service ? '#6366f1' : 'white', color: selectedService === service ? 'white' : '#6366f1', fontWeight: 600, cursor: 'pointer' }}>{service}</button>
                  ))}
                  <button onClick={() => handleServiceSelect('None')} style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'transparent', color: '#666', fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem', textDecoration: 'underline' }}>Skip</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default ChatWidget;
