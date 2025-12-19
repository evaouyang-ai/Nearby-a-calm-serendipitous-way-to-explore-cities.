
import React from 'react';

interface HeroHeaderProps {
  onToggleScrapbook: () => void;
  scrapbookCount: number;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ onToggleScrapbook, scrapbookCount }) => {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
          <h1 className="font-medium text-base md:text-lg tracking-tight text-slate-900 uppercase shrink-0">
            Nearby
          </h1>
        </div>
        <div className="text-[10px] md:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.1em] md:tracking-widest leading-none opacity-90 sm:opacity-100">
          something interesting is closer than you think
        </div>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={onToggleScrapbook}
          className="group flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all p-2"
        >
          <span className="hidden md:inline opacity-0 group-hover:opacity-100 transition-all">Scrapbook</span>
          <div className="relative">
            <i className="fa-solid fa-book-open text-sm md:text-base"></i>
            {scrapbookCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-slate-900 text-white text-[9px] flex items-center justify-center rounded-full">
                {scrapbookCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default HeroHeader;
