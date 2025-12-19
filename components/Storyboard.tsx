
import React, { useState } from 'react';
import { JourneyPlan } from '../types';

interface StoryboardProps {
  plan: JourneyPlan;
  onReset: () => void;
  onViewJournal: () => void;
}

const Storyboard: React.FC<StoryboardProps> = ({ plan, onReset, onViewJournal }) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const handleShare = async () => {
    const text = `A collection of moments co-created with Nearby:\n\n"${plan.introduction}"\n\nStops:\n${plan.steps.map(s => `• ${s.destination.name}`).join('\n')}\n\nExplore at ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nearby Storyboard',
          text: text,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Take a look at my walk with Nearby:\n\n"${plan.introduction}"\n\n${plan.steps.map(s => `• ${s.destination.name}`).join('\n')}\n\nStart your own journey: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-24">
        <h2 className="text-4xl font-serif-italic text-slate-900 mb-4">Past Moments</h2>
        <p className="text-slate-600 text-base italic font-medium">A collection of things noticed on your walk.</p>
        
        <div className="mt-10 flex justify-center gap-10">
          <button 
            onClick={handleShare}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-share-nodes"></i>
            {shareStatus === 'copied' ? 'Copied' : 'Share Story'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {plan.steps.map((step, idx) => (
          <div 
            key={idx} 
            className="group space-y-6"
          >
            <div className="aspect-square bg-white rounded-[2rem] p-10 flex flex-col justify-center text-center border border-slate-200 group-hover:shadow-2xl group-hover:shadow-slate-300/30 transition-all duration-500">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                {step.destination.location}
              </span>
              <h4 className="text-2xl md:text-3xl font-serif-italic text-slate-900 mb-4">
                {step.destination.name}
              </h4>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed italic font-medium">
                "{step.destination.description}"
              </p>
            </div>
            
            <div className="px-4 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">A detail remembered</p>
              <p className="text-slate-700 text-sm italic font-medium">"{step.destination.sensoryDetail}"</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-40 flex flex-col items-center gap-10">
        <button 
          onClick={onReset}
          className="text-base font-bold text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-all"
        >
          Look for something new
        </button>
        <button 
          onClick={onViewJournal}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all"
        >
          View all previous walks
        </button>
      </div>
    </div>
  );
};

export default Storyboard;
