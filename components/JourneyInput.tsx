
import React, { useState } from 'react';

interface JourneyInputProps {
  onStart: (prompt: string, area: string) => void;
  onDrift: () => void;
  onOpenJournal: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

const JourneyInput: React.FC<JourneyInputProps> = ({ onStart, onDrift, onOpenJournal, isLoading, hasHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onStart(prompt, area);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 px-6 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif-italic mb-4 text-slate-900">What's on your mind?</h2>
        <p className="text-slate-600 text-sm md:text-base font-medium italic">Tell me a mood, a detail, or a simple curiosity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-6">
            Where are you? (optional)
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., Kyoto, Brooklyn, or Leave blank for local"
            className="w-full bg-white rounded-[1.5rem] px-6 py-5 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-slate-400 transition-all text-sm md:text-base shadow-sm"
            disabled={isLoading}
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-300/30 p-1 border border-slate-200 focus-within:border-slate-400 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A quiet afternoon, the smell of old paper, a place where the light is soft..."
            className="w-full h-36 bg-transparent rounded-2xl p-6 text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all resize-none text-lg leading-relaxed font-medium"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center p-4">
            <button
              type="button"
              onClick={onDrift}
              disabled={isLoading}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest px-4 transition-all"
            >
              Just drift
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center gap-3 disabled:opacity-20 text-sm md:text-base shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  See what's around
                  <i className="fa-solid fa-arrow-right text-xs opacity-70"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {hasHistory && (
        <div className="mt-10 text-center">
          <button 
            onClick={onOpenJournal}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all underline underline-offset-4 decoration-slate-200"
          >
            Revisit past walks
          </button>
        </div>
      )}

      <div className="mt-14 flex flex-wrap justify-center gap-3">
        {[
          "Quiet reading nooks",
          "Sunlit courtyards",
          "The smell of roasting coffee",
          "Hidden garden walls",
          "Soft jazz and low light"
        ].map((vibe) => (
          <button
            key={vibe}
            onClick={() => setPrompt(vibe)}
            className="text-[11px] font-bold bg-white border border-slate-200 hover:border-slate-400 py-3 px-5 rounded-full text-slate-600 hover:text-slate-900 transition-all shadow-sm"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JourneyInput;
