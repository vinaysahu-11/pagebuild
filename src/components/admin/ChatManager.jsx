import React, { useState, useRef, useEffect } from 'react';
import { Send, User, CreditCard, X } from 'lucide-react';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { useAppContext } from '../../context/AppContext';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
const socket = io(API_BASE_URL);

const ChatManager = () => {
  const { pricingServices } = useAppContext();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [userPaymentStatus, setUserPaymentStatus] = useState('');
  const [inputText, setInputText] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentService, setPaymentService] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('INR');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const db = getFirestore(app);

  // Fetch all users
  useEffect(() => {
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setUsers(userList);
      },
      (error) => {
        console.error('Error fetching users: ', error);
      }
    );
    return () => unsubscribe();
  }, [db]);

  // Socket.IO Listeners
  useEffect(() => {
    if (selectedUser) {
        socket.emit('join_room', selectedUser.uid);
    }

    const handleTypingStart = ({ userId }) => {
      if (selectedUser && selectedUser.uid === userId) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = ({ userId }) => {
      if (selectedUser && selectedUser.uid === userId) {
        setIsTyping(false);
      }
    };

    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [selectedUser]);


  // Listen to selected user's messages
  useEffect(() => {
    if (!selectedUser) {
      setUserMessages([]);
      setUserPaymentStatus('');
      return;
    }
    const messagesQuery = query(collection(db, 'chats', selectedUser.uid, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      let paymentStatus = '';
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.type === 'payment_request') {
          paymentStatus = data.status || 'pending';
        }
        return { id: doc.id, ...data };
      });
      setUserMessages(msgs);
      setUserPaymentStatus(paymentStatus);
    });
    return () => unsubscribe();
  }, [selectedUser, db]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages]);

  const handleTyping = () => {
    if (!selectedUser) return;
    socket.emit('typing_start', { userId: 'admin', recipientId: selectedUser.uid });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { userId: 'admin', recipientId: selectedUser.uid });
    }, 2000);
  };

  // Admin sends a message to selected user
  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !inputText.trim()) return;

    const chatDocRef = doc(db, 'chats', selectedUser.uid, 'messages', Date.now().toString());
    const msg = {
      text: inputText,
      sender: 'admin',
      timestamp: new Date().toISOString(),
      seen: false,
      type: 'text',
    };
    await setDoc(chatDocRef, msg);
    setInputText('');
    socket.emit('typing_stop', { userId: 'admin', recipientId: selectedUser.uid });
    clearTimeout(typingTimeoutRef.current);
  };

  // Admin sends payment request
  const handleSendPaymentRequest = async (e) => {
    e.preventDefault();
    if (!selectedUser || !paymentAmount || !paymentService) return;

    const chatDocRef = doc(db, 'chats', selectedUser.uid, 'messages', Date.now().toString());
    const msg = {
      type: 'payment_request',
      sender: 'admin',
      timestamp: new Date().toISOString(),
      amount: parseFloat(paymentAmount),
      currency: paymentCurrency,
      service: paymentService,
      status: 'pending',
      paymentId: `payment_${Date.now()}`,
    };
    await setDoc(chatDocRef, msg);
    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentService('');
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-100 rounded-lg shadow-lg">
      {/* User List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 font-bold text-lg border-b">Clients</div>
        {users.map((user) => (
          <div
            key={user.uid}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${selectedUser?.uid === user.uid ? 'bg-blue-100' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex items-center">
              <img src={user.photoURL || `https://i.pravatar.cc/40?u=${user.uid}`} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <div className="font-bold">{user.name || 'Anonymous'}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              {user.online && <span className="ml-auto w-3 h-3 bg-green-500 rounded-full"></span>}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-bold">{selectedUser.name || 'Anonymous'}</div>
                  {isTyping ? (
                    <div className="text-sm text-gray-500 h-5 animate-pulse">typing...</div>
                  ) : (
                    <div className="text-sm text-gray-500 h-5">
                      Service: {selectedUser.selectedService || 'Not selected'} | Payment: <span className={userPaymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}>{userPaymentStatus || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setShowPaymentForm(true)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" /> Request Payment
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {userMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} mb-3`}>
                  <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {msg.type === 'text' && <p>{msg.text}</p>}
                    {msg.type === 'payment_request' && (
                      <div>
                        <p className="font-bold">Payment Request</p>
                        <p>Service: {msg.service}</p>
                        <p>Amount: {msg.currency} {msg.amount}</p>
                        <p>Status: <span className={`font-semibold ${msg.status === 'paid' ? 'text-green-300' : 'text-yellow-300'}`}>{msg.status}</span></p>
                      </div>
                    )}
                    {msg.type === 'file' && (
                      <div>
                        <p className="font-bold">File Shared</p>
                        <a href={msg.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                          {msg.fileName || 'Download File'}
                        </a>
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="ml-3 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Payment Request Modal */}
      {showPaymentForm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request Payment</h2>
              <button onClick={() => setShowPaymentForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSendPaymentRequest}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Service</label>
                <select
                  value={paymentService}
                  onChange={(e) => setPaymentService(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a Service</option>
                  {pricingServices.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManager;
