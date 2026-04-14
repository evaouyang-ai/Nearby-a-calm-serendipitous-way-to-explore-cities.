// components/HeroHeader.tsx
// Navigation bar: plain Playfair Display wordmark, no tagline, no blobs.
// Floats above parchment — warm palette only.

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
    <header
      className="flex items-center justify-between sticky top-0 z-50"
      style={{
        padding: '16px 24px',
        backgroundColor: '#F9F6F0',
      }}
    >
      {/* Left: back link + wordmark */}
      <div className="flex items-center gap-6">
        <a
          href="https://lifewitheveai.com/portfolio/"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 400,
            color: '#6B6457',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'color 180ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
        >
          ← Portfolio
        </a>

        {/* Wordmark */}
        <span
          className="font-playfair"
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#1A1814',
          }}
        >
          Nearby
        </span>
      </div>

      {/* Right: nav links + auth */}
      <div className="flex items-center gap-4">

        {/* Discover map */}
        <a
          href="/discover"
          className="hidden md:block"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 400,
            color: '#6B6457',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 180ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
        >
          Discover
        </a>

        {/* Journal / Scrapbook */}
        <button
          onClick={onToggleScrapbook}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 400,
            color: '#6B6457',
            letterSpacing: '0.04em',
            transition: 'color 180ms ease',
            padding: '4px 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
        >
          <span className="hidden md:inline">Journal</span>
          <span style={{ position: 'relative' }}>
            <i className="fa-solid fa-book-open" style={{ fontSize: '13px' }}></i>
            {scrapbookCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#1A1814',
                  color: '#F9F6F0',
                  fontSize: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                }}
              >
                {scrapbookCount}
              </span>
            )}
          </span>
        </button>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '2px',
                backgroundColor: '#EDE9E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 500,
                    color: '#6B6457',
                    textTransform: 'uppercase',
                  }}
                >
                  {(user.email ?? '?')[0]}
                </span>
              )}
            </div>
            <button
              onClick={onSignOut}
              className="hidden md:block"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B6457',
                letterSpacing: '0.04em',
                transition: 'color 180ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#1A1814',
              backgroundColor: 'transparent',
              border: '1px solid #1A1814',
              borderRadius: '4px',
              padding: '6px 14px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'background-color 180ms ease, color 180ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1A1814';
              e.currentTarget.style.color = '#F9F6F0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1A1814';
            }}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default HeroHeader;
