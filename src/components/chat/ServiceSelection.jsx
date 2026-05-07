import React, { useState } from 'react';
import { CheckCircle, Edit3 } from 'lucide-react';

const ServiceSelection = ({ services, onServiceSelect }) => {
  const [selected, setSelected] = useState(null);
  const [customProject, setCustomProject] = useState('');

  const handleSelect = (service) => {
    setSelected(service.title);
    if (service.title !== 'Custom Project') {
      onServiceSelect(service.title);
    }
  };

  const handleCustomSubmit = () => {
    if (customProject.trim()) {
      onServiceSelect(`Custom: ${customProject.trim()}`);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h3 className="font-bold text-xl mb-1 text-white">Select a Service</h3>
      <p className="text-slate-400 mb-6">What can we help you build today?</p>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleSelect(service)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selected === service.title
                ? 'bg-indigo-600/20 border-indigo-500'
                : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">{service.title}</h4>
              {selected === service.title && <CheckCircle className="text-indigo-400" size={20} />}
            </div>
            <p className="text-sm text-slate-400 mt-1">{service.desc}</p>
          </button>
        ))}
      </div>

      {selected === 'Custom Project' && (
        <div className="mt-4 animate-fade-in-up">
          <div className="relative">
            <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <textarea
              placeholder="Briefly describe your custom project requirements..."
              value={customProject}
              onChange={(e) => setCustomProject(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="3"
            />
          </div>
          <button 
            onClick={handleCustomSubmit} 
            className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-3 font-semibold hover:bg-indigo-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!customProject.trim()}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
