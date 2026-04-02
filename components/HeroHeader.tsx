// components/HeroHeader.tsx — Production version
// Added: user avatar, sign-in/out button, "Discover" public map link

import React from 'react';
import type { User } from '@supabase/supabase-js';

interface HeroHeaderProps {
  onToggleScrapbook: () => void;
  scrapbookCount: number;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({
  onToggleScrapbook,
  scrapbookCount,
  user,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
      {/* Logo + tagline */}
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

      {/* Right side actions */}
      <div className="flex items-center gap-1 md:gap-3">

        {/* Public discover map */}
        <a
          href="/discover"
          className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all p-2"
        >
          <i className="fa-solid fa-earth-americas text-sm"></i>
          <span>Discover</span>
        </a>

        {/* Scrapbook / Journal */}
        <button
          onClick={onToggleScrapbook}
          className="group flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-all p-2"
        >
          <span className="hidden md:inline opacity-0 group-hover:opacity-100 transition-all">
            Journal
          </span>
          <div className="relative">
            <i className="fa-solid fa-book-open text-sm md:text-base"></i>
            {scrapbookCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-slate-900 text-white text-[9px] flex items-center justify-center rounded-full">
                {scrapbookCount}
              </span>
            )}
          </div>
        </button>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2 ml-1">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[11px] font-bold text-slate-600 uppercase">
                  {(user.email ?? '?')[0]}
                </span>
              )}
            </div>
            <button
              onClick={onSignOut}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-all hidden md:block"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="ml-1 text-[11px] font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default HeroHeader;
