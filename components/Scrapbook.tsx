
import React from 'react';
import { JourneyMemory } from '../types';

interface ScrapbookProps {
  memories: JourneyMemory[];
  isOpen: boolean;
  onClose: () => void;
  onRevisit: (memory: JourneyMemory) => void;
}

const Scrapbook: React.FC<ScrapbookProps> = ({ memories, isOpen, onClose, onRevisit }) => {
  if (!isOpen) return null;

  const handleShare = async (memory: JourneyMemory) => {
    const text = `A journey from my journal:\n\n"${memory.plan.introduction}"\n\nStops recorded: ${memory.plan.steps.map(s => s.destination.name).join(', ')}\n\nExplore at ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: text, url: window.location.origin });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl animate-in fade-in duration-500 flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 border-b border-slate-100 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div>
          <h2 className="text-3xl font-serif-italic text-slate-900">Journal</h2>
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold mt-1">Your past observations</p>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark text-slate-500"></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-12">
          {memories.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-slate-400 font-serif-italic text-xl">The pages are empty...</p>
              <p className="text-slate-500 text-xs mt-4 uppercase tracking-widest font-bold">Go for a walk to begin</p>
            </div>
          ) : (
            memories.map((memory) => (
              <div 
                key={memory.id}
                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-300/30 transition-all duration-700"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    {new Date(memory.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="flex gap-3 items-center">
                    <button 
                      onClick={() => handleShare(memory)}
                      className="text-sm text-slate-400 hover:text-slate-800 p-2 transition-colors"
                      title="Share this entry"
                    >
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                    {memory.plan.steps.slice(0, 2).map((step, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded uppercase tracking-wider font-bold">
                        {step.destination.location}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-xl md:text-2xl font-serif-italic text-slate-900 leading-relaxed italic">
                    "{memory.plan.introduction}"
                  </p>
                  
                  {/* First memory detail preview */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">First detail noted:</p>
                    <p className="text-slate-700 text-sm italic font-medium">"{memory.plan.steps[0]?.destination.sensoryDetail}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic font-medium">
                      {memory.plan.steps.length} moments recorded
                    </p>
                    <button 
                      onClick={() => onRevisit(memory)}
                      className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-[0.3em] transition-all flex items-center gap-3"
                    >
                      Open Walk
                      <i className="fa-solid fa-arrow-right-long opacity-100 group-hover:translate-x-1 transition-all"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">Nearby Archive — Co-created with Emily</p>
      </div>
    </div>
  );
};

export default Scrapbook;
