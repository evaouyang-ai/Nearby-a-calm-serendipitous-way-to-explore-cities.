
import React, { useState } from 'react';
import { JourneyPlan, ItineraryStep } from '../types';

interface ItineraryViewProps {
  plan: JourneyPlan;
  citations: any[];
  onComplete: () => void;
  onReset: () => void;
  onRefract: (stepIdx: number) => Promise<void>;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ plan, citations, onComplete, onReset, onRefract }) => {
  const [refractingIdx, setRefractingIdx] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const getMapsSearchUrl = (name: string, location: string) => {
    const cleanName = name.replace(/^(Lingering near|Discovering|Visiting|At the|Exploring|Checking out|Near)\s+/i, '').trim();
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName + ' ' + location)}`;
  };

  const handleRefract = async (idx: number) => {
    setRefractingIdx(idx);
    try {
      await onRefract(idx);
    } finally {
      setRefractingIdx(null);
    }
  };

  const handleShare = async () => {
    const text = `A quiet walk co-created with Nearby:\n\n"${plan.introduction}"\n\nStops:\n${plan.steps.map(s => `• ${s.destination.name} (${s.destination.location})`).join('\n')}\n\nExplore your own surroundings at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Journey with Nearby',
          text: text,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(text);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Check out this walk from Nearby:\n\n"${plan.introduction}"\n\n${plan.steps.map(s => `• ${s.destination.name}`).join('\n')}\n\nExplore at: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-24 animate-in fade-in duration-1000">
        <p className="text-xl md:text-2xl font-serif-italic text-slate-900 leading-relaxed max-w-lg mx-auto">
          "{plan.introduction}"
        </p>
      </div>

      <div className="space-y-32 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>

        {plan.steps.map((step, idx) => (
          <div key={idx} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-300 z-10 group-hover:bg-slate-500 transition-colors"></div>
            
            <div className={`pt-10 space-y-8 text-center transition-opacity duration-500 ${refractingIdx === idx ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                <span>{step.estimatedTime}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-serif-italic text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{step.destination.location}</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                  {step.destination.description}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-100/50 rounded-2xl border border-slate-200">
                  <i className="fa-solid fa-eye text-slate-400 text-xs"></i>
                  <p className="text-slate-600 text-sm italic font-medium">
                    Noticed: "{step.destination.sensoryDetail}"
                  </p>
                </div>
                
                <button 
                  onClick={() => handleRefract(idx)}
                  disabled={refractingIdx !== null}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all underline underline-offset-4 decoration-slate-200"
                >
                  {refractingIdx === idx ? 'Looking closer...' : 'Look closer'}
                </button>
              </div>

              <div className="pt-4 flex flex-col items-center gap-12">
                <a 
                  href={getMapsSearchUrl(step.destination.name, step.destination.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-all uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full border border-blue-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <i className="fa-solid fa-location-dot"></i>
                  View on Map
                </a>

                {idx < plan.steps.length - 1 && (
                  <div className="max-w-sm mx-auto text-center px-4">
                    <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
                      {step.narrativeBridge}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-48 text-center space-y-12">
        <div className="w-12 h-1 bg-slate-200 mx-auto"></div>
        <p className="text-xl md:text-2xl font-serif-italic text-slate-900 italic leading-relaxed max-w-md mx-auto">
          "{plan.conclusion}"
        </p>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <button 
              onClick={onComplete}
              className="w-full max-w-xs bg-slate-900 text-white text-xs font-bold py-5 px-8 rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Finish & Keep notes
            </button>
            
            <button 
              onClick={onReset}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all"
            >
              Look for something new
            </button>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <button 
              onClick={handleShare}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-share-nodes"></i>
              {shareStatus === 'copied' ? 'Copied' : 'Share'}
            </button>
            <button 
              onClick={shareOnWhatsApp}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {citations.length > 0 && (
        <div className="mt-32 pt-12 border-t border-slate-200 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">Observations verified by</span>
          <div className="flex flex-wrap justify-center gap-3">
            {citations.map((cite, i) => (
              <a 
                key={i} 
                href={cite.web?.uri || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all border border-slate-200"
              >
                {cite.web?.title || 'Verified place'}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryView;
