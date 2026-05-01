import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Try to load from localStorage or use defaults
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [location, setLocation] = useState(loadState('location', 'IN'));
  const [chats, setChats] = useState(loadState('chats', [
    { id: 1, text: 'Hi! I need a website for my business.', sender: 'user', timestamp: new Date().toISOString(), isRead: true },
    { id: 2, text: 'Hello! We can build it in 7 days. What type of business is it?', sender: 'admin', timestamp: new Date().toISOString(), isRead: true }
  ]));
  const [clients, setClients] = useState(loadState('clients', [
    { id: '1', name: 'Ravi Kumar', project: 'E-commerce App', deadline: '2026-05-08', amount: '₹40,000', status: 'In Progress', payment: 'Paid' },
    { id: '2', name: 'Sarah Jenkins', project: 'SaaS Dashboard', deadline: '2026-05-05', amount: '$1,500', status: 'Review', payment: 'Pending' }
  ]));
  
  const [isAuthenticated, setIsAuthenticated] = useState(loadState('auth', false));

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const addChat = (text, sender) => {
    const newChat = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString(),
      isRead: sender === 'admin' ? false : true
    };
    setChats(prev => [...prev, newChat]);
  };

  const login = (email, password) => {
    // Dummy authentication logic
    if (email === 'admin@pagebuild.com' && password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      location, setLocation,
      chats, addChat,
      clients, setClients,
      isAuthenticated, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
