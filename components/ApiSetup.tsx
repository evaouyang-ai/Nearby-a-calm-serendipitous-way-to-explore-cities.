
import React from 'react';

interface ApiSetupProps {
  onComplete: () => void;
}

const ApiSetup: React.FC<ApiSetupProps> = ({ onComplete }) => {
  const handleConnect = async () => {
    try {
      await window.aistudio.openSelectKey();
      onComplete();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 px-6 text-center animate-in fade-in duration-1000">
      <div className="mb-12 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 shadow-xl">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
      
      <h2 className="text-3xl font-serif-italic mb-6 text-slate-900">
        Connect to Nearby
      </h2>
      
      <p className="text-slate-400 mb-12 text-sm leading-relaxed">
        Emily needs a connection to the Gemini network to help you notice what's around you.
      </p>

      <button
        onClick={handleConnect}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-5 rounded-2xl transition-all shadow-xl active:scale-95 text-sm"
      >
        Select a project to begin
      </button>
      
      <p className="mt-12 text-[9px] font-bold text-slate-200 uppercase tracking-[0.3em]">
        observational intelligence — Gemini 3 Flash
      </p>
    </div>
  );
};

export default ApiSetup;
