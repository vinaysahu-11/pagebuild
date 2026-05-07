import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Modal from './Modal';

const AuthModal = ({ onGoogleLogin, onEmailLogin, onEmailSignup, error, onClose, isOpen }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onEmailLogin(email, password);
    } else {
      onEmailSignup(name, email, password);
    }
  };

  const title = isLogin ? 'Welcome Back' : 'Create Account';
  const description = isLogin ? 'Sign in to continue to your private chat.' : 'Join to start a private chat with our team.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      {error && <p className="bg-red-500/20 text-red-300 text-sm text-center rounded-md p-3 mb-4">{error}</p>}

      <button 
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 hover:bg-slate-700 transition-colors rounded-lg p-3 font-semibold mb-4"
      >
        <img src="/google.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="flex items-center my-6">
        <hr className="w-full border-slate-700" />
        <span className="px-2 text-slate-500 text-sm">OR</span>
        <hr className="w-full border-slate-700" />
      </div>

      <form onSubmit={handleEmailSubmit}>
        {!isLogin && (
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg p-3 font-semibold">
          {isLogin ? 'Login with Email' : 'Sign Up with Email'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </Modal>
  );
};

export default AuthModal;
