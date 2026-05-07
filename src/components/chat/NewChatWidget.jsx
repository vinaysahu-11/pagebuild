import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import { useAppContext } from '../../context/AppContext';

import ChatButton from './ChatButton';
import AuthModal from './AuthModal';
import ServiceSelection from './ServiceSelection';
import ChatWindow from './ChatWindow';

const NewChatWidget = () => {
  const { pricingServices = [] } = useAppContext() || {};
  const [widgetState, setWidgetState] = useState('closed'); // closed, auth, service, chat
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const resetWidget = useCallback(() => {
    setWidgetState('closed');
    setAuthError('');
    setMessages([]);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    resetWidget();
  };

  // Main auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        
        setUser({ ...currentUser, ...userData });

        // If user is logged in, but widget was closed, don't automatically open it.
        // The user will click the button to open it.
        if (widgetState !== 'closed') {
            if (userData.selectedService) {
                setWidgetState('chat');
            } else {
                setWidgetState('service');
            }
        }
      } else {
        setUser(null);
        if (widgetState !== 'closed') {
            setWidgetState('auth');
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db, widgetState]);

  // Message listener
  useEffect(() => {
    if (user && widgetState === 'chat') {
      const messagesQuery = query(collection(db, 'chats', user.uid, 'messages'), orderBy('timestamp'));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      }, (error) => {
        console.error("Error fetching messages:", error);
      });
      return () => unsubscribe();
    }
  }, [user, widgetState, db]);

  const handleChatButtonClick = () => {
    if (user) {
      setWidgetState(user.selectedService ? 'chat' : 'service');
    } else {
      setWidgetState('auth');
    }
  };

  const handleClose = () => {
    setWidgetState('closed');
  };

  // --- Auth Handlers ---
  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: u.uid,
          name: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
          role: 'client',
          createdAt: new Date().toISOString(),
          online: true,
        }, { merge: true });
      }
      // onAuthStateChanged will handle the state transition
    } catch (err) {
      setAuthError('Google login failed. Please try again.');
      console.error(err);
    }
  };

  const handleEmailLogin = async (email, password) => {
    setAuthError('');
    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the state transition
    } catch (err) {
      setAuthError(err.message || 'Login failed. Check your credentials.');
    }
  };

  const handleEmailSignup = async (name, email, password) => {
    setAuthError('');
    if (!name || !email || !password) {
      setAuthError('Name, email, and password are required.');
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const u = result.user;
      await setDoc(doc(db, 'users', u.uid), {
        uid: u.uid,
        name: name,
        email: u.email,
        photoURL: null,
        role: 'client',
        createdAt: new Date().toISOString(),
        online: true,
      });
      // onAuthStateChanged will handle the state transition
    } catch (err) {
      setAuthError(err.message || 'Signup failed. Please try again.');
    }
  };

  // --- Service & Message Handlers ---
  const handleServiceSelect = async (serviceName) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { selectedService: serviceName }, { merge: true });
    setUser(prev => ({ ...prev, selectedService: serviceName }));

    const welcomeMessage = {
      text: `Thank you for selecting "${serviceName}". An agent will be with you shortly.`,
      sender: 'system',
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    const chatDocRef = doc(db, 'chats', user.uid, 'messages', Date.now().toString());
    await setDoc(chatDocRef, welcomeMessage);
    
    setWidgetState('chat');
  };

  const handleSendMessage = async (text, file) => {
    if (!user) return;
    const timestamp = new Date().toISOString();
    
    if (file) {
      const messageId = Date.now().toString();
      const fileRef = storageRef(storage, `chats/${user.uid}/${messageId}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed',
        (snapshot) => { /* Can be used for progress bar */ },
        (error) => { console.error("Upload failed:", error); },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const fileMsg = {
            type: 'file',
            sender: 'user',
            timestamp,
            fileURL: downloadURL,
            fileName: file.name,
            seen: false,
          };
          await setDoc(doc(db, 'chats', user.uid, 'messages', messageId), fileMsg);
        }
      );
    }

    if (text.trim()) {
      const textMsg = {
        text: text.trim(),
        sender: 'user',
        timestamp,
        seen: false,
        type: 'text',
      };
      await setDoc(doc(db, 'chats', user.uid, 'messages', `${Date.now().toString()}_text`), textMsg);
    }
  };

  const renderContent = () => {
    if (widgetState === 'closed') return null;

    if (widgetState === 'chat') {
      return (
        <div className="fixed bottom-5 right-5 z-[99] w-[400px] h-[650px] bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-fade-in-up">
            <ChatWindow 
              messages={messages}
              onSend={handleSendMessage}
              user={user}
              isTyping={isTyping}
              onClose={handleClose}
            />
        </div>
      );
    }

    if (widgetState === 'service') {
        return (
            <div className="fixed bottom-5 right-5 z-[99] w-[400px] h-[650px] bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-fade-in-up">
                <ServiceSelection services={pricingServices} onServiceSelect={handleServiceSelect} />
            </div>
        );
    }

    return null;
  };

  return (
    <>
      {widgetState === 'closed' && <ChatButton onClick={handleChatButtonClick} />}
      
      <AuthModal 
        isOpen={widgetState === 'auth'}
        onClose={handleClose}
        onGoogleLogin={handleGoogleLogin}
        onEmailLogin={handleEmailLogin}
        onEmailSignup={handleEmailSignup}
        error={authError}
      />

      {renderContent()}
    </>
  );
};

export default NewChatWidget;
