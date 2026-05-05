import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { forwardRef, useImperativeHandle } from 'react';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

const ChatWidget = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    open: (service) => {
      setIsOpen(true);
      if (service) {
        setShowAuth(true);
        setAuthStep('service');
        setSelectedService(service);
      }
    },
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { chats, addChat, addClient } = useAppContext();
  const messagesEndRef = useRef(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const services = ['Website', 'App', 'SEO', 'Marketing'];
  const auth = getAuth(app);
  const db = getFirestore(app);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
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
  const handleAnonLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    try {
      const res = await signInAnonymously(auth);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      addClient({
        name,
        project: 'Pending Discussion',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 'TBD',
        status: 'New Lead',
        payment: 'Pending',
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
    if (service !== 'None') {
      addChat(`Selected service: ${service}`, 'user');
    }
  };
  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const loadPayPal = (clientId) => new Promise(resolve => {
    if (window.paypal) return resolve(true);
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const [paypalOrder, setPaypalOrder] = useState(null); // to show paypal buttons

  const handlePayment = async (chat) => {
    try {
      setIsProcessingPayment(true);
      
      // Step 1: Create Order
      const res = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: chat.amount,
          currency: chat.currency,
          serviceName: chat.service,
          userId: user?.uid || 'anonymous',
          chatId: user?.uid || 'anonymous_chat',
        })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert('Failed to create order');
        setIsProcessingPayment(false);
        return;
      }

      if (data.mockMode) {
        alert('Backend is in Mock Mode! Please add RAZORPAY_KEY_ID or PAYPAL_CLIENT_ID to your backend/.env file to see the real payment gateways.');
        // Still simulate success so they can test flow
        setTimeout(async () => {
          await fetch(`${API_BASE_URL}/api/payments/webhook/${data.gateway}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: data.paymentId,
              status: 'success',
              mockMode: true,
              transactionId: `mock_txn_${Date.now()}`
            })
          });
          setIsProcessingPayment(false);
        }, 1000);
        return;
      }

      // Step 2: Real Gateway Integration
      if (data.gateway === 'razorpay') {
        const loaded = await loadRazorpay();
        if (!loaded) {
          alert('Failed to load Razorpay SDK');
          setIsProcessingPayment(false);
          return;
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'PageBuild SaaS',
          description: chat.service,
          order_id: data.orderId,
          handler: async function (response) {
            // Razorpay automatically calls the backend webhook, but we can also manually call a success endpoint or just let the socket handle it.
            // Since we rely on Webhooks + Sockets, we don't need to do anything here except close loading state.
            setIsProcessingPayment(false);
          },
          prefill: {
            name: user?.name || 'Customer',
            email: user?.email || 'customer@example.com',
          },
          theme: {
            color: '#6366f1'
          },
          modal: {
            ondismiss: function() {
              setIsProcessingPayment(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert('Payment Failed');
          setIsProcessingPayment(false);
        });
        rzp.open();
      } 
      else if (data.gateway === 'paypal') {
        const loaded = await loadPayPal(data.clientId);
        if (!loaded) {
          alert('Failed to load PayPal SDK');
          setIsProcessingPayment(false);
          return;
        }
        
        // Render PayPal buttons directly in the widget for this specific chat
        setPaypalOrder({
          chatId: chat.id,
          orderId: data.orderId,
          paymentId: data.paymentId
        });
        
        setIsProcessingPayment(false);
      }

    } catch (err) {
      console.error(err);
      alert('Error processing payment');
      setIsProcessingPayment(false);
    }
  };

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
      <button
        className="chat-widget-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!user) {
            setShowAuth(true);
            setAuthStep('login');
          }
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div
              style={{
                fontWeight: '600',
              }}
            >
              Chat with us
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                opacity: 0.8,
              }}
            >
              We usually reply instantly
            </div>
          </div>
          <div className="chat-messages">
            {chats.map((chat) => (
              <div key={chat.id} className={`message ${chat.sender}`} style={{
                background: chat.type === 'payment_request' ? 'white' : undefined,
                color: chat.type === 'payment_request' ? '#333' : undefined,
                border: chat.type === 'payment_request' ? '1px solid #ddd' : undefined,
                boxShadow: chat.type === 'payment_request' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined,
              }}>
                {chat.type === 'payment_request' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                    <strong style={{ fontSize: '1rem' }}>Payment Request</strong>
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>{chat.service}</span>
                    <h3 style={{ margin: '0.5rem 0', color: '#6366f1', fontSize: '1.5rem' }}>
                      {chat.currency === 'INR' ? '₹' : '$'}{chat.amount}
                    </h3>
                    
                    {chat.status === 'success' ? (
                      <div style={{
                        padding: '0.5rem',
                        background: '#dcfce7',
                        color: '#166534',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginTop: '0.5rem'
                      }}>
                        Payment Successful ✓
                      </div>
                    ) : paypalOrder?.chatId === chat.id ? (
                      <div style={{ marginTop: '0.5rem' }} id={`paypal-button-container-${chat.id}`} ref={(el) => {
                        if (el && !el.hasChildNodes() && window.paypal) {
                          window.paypal.Buttons({
                            createOrder: () => paypalOrder.orderId,
                            onApprove: async (data, actions) => {
                              // Manually call the paypal webhook since we are running locally without internet exposure
                              await fetch(`${API_BASE_URL}/api/payments/webhook/paypal`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  paymentId: paypalOrder.paymentId,
                                  status: 'success',
                                  transactionId: data.orderID
                                })
                              });
                              setPaypalOrder(null);
                            },
                            onCancel: () => {
                              setPaypalOrder(null);
                            },
                            onError: () => {
                              alert('PayPal Checkout Error');
                              setPaypalOrder(null);
                            }
                          }).render(el);
                        }
                      }}></div>
                    ) : (
                      <button
                        onClick={() => handlePayment(chat)}
                        disabled={isProcessingPayment}
                        style={{
                          background: '#6366f1',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                          opacity: isProcessingPayment ? 0.7 : 1,
                          marginTop: '0.5rem',
                          transition: 'background 0.2s'
                        }}
                      >
                        {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                ) : (
                  chat.text
                )}
                <div
                  style={{
                    fontSize: '0.65rem',
                    marginTop: '4px',
                    opacity: 0.7,
                    textAlign: chat.sender === 'user' ? 'right' : 'left',
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
          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!user || !selectedService}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!user || !selectedService}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {}
      {showAuth && (
        <div
          className="chat-auth-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              minWidth: '320px',
              maxWidth: '90vw',
              boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
            }}
          >
            {(authStep === 'login' || authStep === 'signup') && (
              <>
                <h3
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  Continue to Chat
                </h3>
                {error && (
                  <div
                    style={{
                      color: 'red',
                      marginBottom: '1rem',
                    }}
                  >
                    {error}
                  </div>
                )}
                <form
                  onSubmit={handleAnonLogin}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Continue
                  </button>
                </form>
              </>
            )}
            {authStep === 'service' && (
              <>
                <h3
                  style={{
                    marginBottom: '1rem',
                    textAlign: 'center',
                  }}
                >
                  What are you looking for?
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #6366f1',
                        background:
                          selectedService === service ? '#6366f1' : 'white',
                        color:
                          selectedService === service ? 'white' : '#6366f1',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {service}
                    </button>
                  ))}
                  <button
                    onClick={() => handleServiceSelect('None')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: '#666',
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Skip
                  </button>
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
