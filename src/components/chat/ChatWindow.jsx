import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Download, File as FileIcon, Image as ImageIcon, Video, Music, Archive } from 'lucide-react';

const getFileIcon = (fileName) => {
  if (!fileName) return <FileIcon size={32} />;
  const extension = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return <ImageIcon size={32} />;
  if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return <Video size={32} />;
  if (['mp3', 'wav', 'ogg'].includes(extension)) return <Music size={32} />;
  if (['zip', 'rar', '7z'].includes(extension)) return <Archive size={32} />;
  return <FileIcon size={32} />;
};

const ChatWindow = ({ messages, onSend, onFileUpload, user, isTyping, onClose }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = () => {
    if (text.trim() || file) {
      onSend(text, file);
      setText('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(selectedFile.name);
      }
    }
  };

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'text':
        return <p>{msg.text}</p>;
      case 'file':
        return (
          <a href={msg.fileURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors">
            <div className="flex-shrink-0 text-slate-300">{getFileIcon(msg.fileName)}</div>
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{msg.fileName || 'Shared File'}</p>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Download size={12} />
                Click to download
              </span>
            </div>
          </a>
        );
      case 'payment_request':
        // This will be handled by a dedicated component later
        return (
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="font-bold">Payment Request</p>
            <p>Service: {msg.service}</p>
            <p>Amount: {msg.currency} {msg.amount}</p>
            <button className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg">
              {msg.status === 'paid' ? 'Paid' : 'Pay Now'}
            </button>
          </div>
        );
      case 'system':
        return <p className="italic text-slate-400">{msg.text}</p>;
      default:
        return <p>{msg.text}</p>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name || 'User'}`} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-700" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold">PageBuild Support</h3>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </header>

      {/* Messages Body */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender !== 'user' && <img src="/logo-mark.png" alt="Admin" className="w-8 h-8 rounded-full self-start" />}
              <div
                className={`max-w-md p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 rounded-br-none'
                    : 'bg-slate-800 rounded-bl-none'
                }`}
              >
                {renderMessageContent(msg)}
                <p className="text-xs text-slate-400 mt-2 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <img src="/logo-mark.png" alt="Admin" className="w-8 h-8 rounded-full self-start" />
              <div className="max-w-md p-3 rounded-2xl bg-slate-800 rounded-bl-none">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="p-4 border-t border-slate-800">
        {preview && (
          <div className="relative p-2 mb-2 bg-slate-800 rounded-lg">
            <button onClick={() => { setFile(null); setPreview(null); fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-slate-600 text-white rounded-full p-0.5">
              <X size={14} />
            </button>
            {typeof preview === 'string' && preview.startsWith('data:image') ? (
              <img src={preview} alt="Preview" className="max-h-24 rounded-md" />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <FileIcon />
                <span>{preview}</span>
              </div>
            )}
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type your message..."
            className="w-full bg-slate-800 rounded-full py-3 pl-12 pr-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <Paperclip size={22} />
          </button>
          <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
