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
  // THEME STATE
  const [theme, setTheme] = useState(() => loadState('theme', 'dark'));
    // Apply theme to <html> root
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);
  const [chats, setChats] = useState(loadState('chats', [
    { id: 1, text: 'Hi! I need a website for my business.', sender: 'user', timestamp: new Date().toISOString(), isRead: true },
    { id: 2, text: 'Hello! We can build it in 7 days. What type of business is it?', sender: 'admin', timestamp: new Date().toISOString(), isRead: true }
  ]));
  const [clients, setClients] = useState(loadState('clients', []));
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const addClient = (clientData) => {
    setClients(prev => [...prev, { id: Date.now().toString(), ...clientData }]);
  };

  const updateClient = (id, updatedData) => {
    setClients(prev => prev.map(client => client.id === id ? { ...client, ...updatedData } : client));
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(client => client.id !== id));
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
      clients, setClients, addClient, updateClient, deleteClient,
      isAuthenticated, login, logout,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};
