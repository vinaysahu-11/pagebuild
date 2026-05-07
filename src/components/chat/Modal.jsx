import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ children, isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl text-white animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {title && <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>}
          {description && <p className="text-slate-400 text-center mb-6">{description}</p>}
          {children}
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
