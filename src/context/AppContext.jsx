import React, { createContext, useContext, useState, useEffect } from 'react';
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);
export const AppProvider = ({ children }) => {
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };
  const [location, setLocation] = useState(loadState('location', 'IN'));
  const [theme, setTheme] = useState(() => loadState('theme', 'dark'));
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);
  const [chats, setChats] = useState(
    loadState('chats', [
      {
        id: 1,
        text: 'Hi! I need a website for my business.',
        sender: 'user',
        timestamp: new Date().toISOString(),
        isRead: true,
      },
      {
        id: 2,
        text: 'Hello! We can build it in 7 days. What type of business is it?',
        sender: 'admin',
        timestamp: new Date().toISOString(),
        isRead: true,
      },
    ])
  );
  const [clients, setClients] = useState(loadState('clients', []));
  const [exchangeRates, setExchangeRates] = useState(
    loadState('exchangeRates', {
      USD: 1,
      INR: 83.5,
    })
  );
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
          localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        }
      })
      .catch((err) => console.error('Could not fetch exchange rates', err));
  }, []);
  const defaultServices = [
    {
      id: 'landing',
      title: 'Landing Page',
      iconName: 'Rocket',
      iconColor: 'var(--primary-color)',
      desc: 'High-conversion, single-page design.',
      priceIN: '15,000',
      priceUS: '499',
      features: [
        'Custom Design',
        'Mobile Responsive',
        'Lead Form',
        '7-Day Delivery',
      ],
      popular: false,
    },
    {
      id: 'business',
      title: 'Business Website',
      iconName: 'Globe',
      iconColor: 'var(--secondary-color)',
      desc: 'Professional presence (5 Pages + CMS).',
      priceIN: '30,000',
      priceUS: '899',
      features: [
        'Up to 5 Pages',
        'CMS Integration',
        'SEO Optimized',
        '7-Day Delivery',
      ],
      popular: false,
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      iconName: 'ShoppingCart',
      iconColor: 'var(--success)',
      desc: 'Full online store to sell products.',
      priceIN: '60,000',
      priceUS: '1,499',
      features: [
        'Shopify/WooCommerce',
        'Payment Gateway',
        'Product Catalog',
        '7-Day Delivery',
      ],
      popular: true,
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      iconName: 'Smartphone',
      iconColor: 'var(--warning)',
      desc: 'Native-feel iOS & Android apps.',
      priceIN: '1,50,000',
      priceUS: '2,499',
      features: [
        'Cross-platform',
        'App Store Setup',
        'API Integration',
        'Fast Turnaround',
      ],
      popular: false,
    },
    {
      id: 'customweb',
      title: 'Custom Web App',
      iconName: 'Code',
      iconColor: '#8b5cf6',
      desc: 'Complex web applications & portals.',
      priceIN: '2,00,000',
      priceUS: '4,999',
      features: [
        'Custom Logic',
        'User Authentication',
        'Database Setup',
        'Scalable Architecture',
      ],
      popular: false,
    },
    {
      id: 'saas',
      title: 'SaaS MVP',
      iconName: 'Cpu',
      iconColor: '#f43f5e',
      desc: 'Launch your startup idea fast.',
      priceIN: '4,00,000',
      priceUS: '9,999',
      features: [
        'Full Stack Dev',
        'Admin Dashboard',
        'Subscription Billing',
        'Launch Ready',
      ],
      popular: false,
    },
  ];
  const [pricingServices, setPricingServices] = useState(
    loadState('pricingServices', defaultServices)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    localStorage.setItem('pricingServices', JSON.stringify(pricingServices));
  }, [pricingServices]);
  const addChat = (text, sender) => {
    const newChat = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString(),
      isRead: sender === 'admin' ? false : true,
    };
    setChats((prev) => [...prev, newChat]);
  };
  const addClient = (clientData) => {
    setClients((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...clientData,
      },
    ]);
  };
  const updateClient = (id, updatedData) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              ...updatedData,
            }
          : client
      )
    );
  };
  const deleteClient = (id) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };
  const addService = (serviceData) => {
    setPricingServices((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...serviceData,
      },
    ]);
  };
  const updateService = (id, updatedData) => {
    setPricingServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              ...updatedData,
            }
          : service
      )
    );
  };
  const deleteService = (id) => {
    setPricingServices((prev) => prev.filter((service) => service.id !== id));
  };
  const login = (email, password) => {
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
    <AppContext.Provider
      value={{
        location,
        setLocation,
        chats,
        addChat,
        clients,
        setClients,
        addClient,
        updateClient,
        deleteClient,
        pricingServices,
        setPricingServices,
        addService,
        updateService,
        deleteService,
        isAuthenticated,
        login,
        logout,
        theme,
        setTheme,
        exchangeRates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
