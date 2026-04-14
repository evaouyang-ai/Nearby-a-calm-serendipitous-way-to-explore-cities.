// components/JourneyInput.tsx
// Search form below the hero image.
// White card on parchment, outlined stamp button, square suggestion pills.

import React, { useState } from 'react';

interface JourneyInputProps {
  onStart: (prompt: string, area: string) => void;
  onDrift: () => void;
  onOpenJournal: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

const VIBES = [
  'Quiet reading nooks',
  'Sunlit courtyards',
  'The smell of roasting coffee',
  'Hidden garden walls',
  'Soft jazz and low light',
];

const JourneyInput: React.FC<JourneyInputProps> = ({
  onStart,
  onDrift,
  onOpenJournal,
  isLoading,
  hasHistory,
}) => {
  const [prompt, setPrompt] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onStart(prompt, area);
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '56px 24px 80px' }}>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Location input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              color: '#1A1814',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              paddingLeft: '2px',
            }}
          >
            Where are you? (optional)
          </label>
          <input
            type="text"
            value={area}
            onChange={e => setArea(e.target.value)}
            placeholder="e.g., Kyoto, Brooklyn, or leave blank for local"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDD8CE',
              borderRadius: '4px',
              padding: '12px 16px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#1A1814',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 180ms ease',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#1A1814')}
            onBlur={e => (e.currentTarget.style.borderColor = '#DDD8CE')}
          />
        </div>

        {/* Main prompt card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDD8CE',
            borderRadius: '4px',
            overflow: 'hidden',
            transition: 'border-color 180ms ease',
          }}
          onFocusCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1A1814')}
          onBlurCapture={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#DDD8CE')}
        >
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g., A quiet afternoon, the smell of old paper, a place where the light is soft..."
            disabled={isLoading}
            rows={5}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '20px 20px 8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              color: '#1A1814',
              lineHeight: 1.75,
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Card footer: drift link + submit button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px 16px',
            }}
          >
            <button
              type="button"
              onClick={onDrift}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B6457',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 180ms ease',
                padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
            >
              Just drift
            </button>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: '#1A1814',
                backgroundColor: 'transparent',
                border: '1px solid #1A1814',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !prompt.trim() ? 0.35 : 1,
                transition: 'background-color 180ms ease, color 180ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => {
                if (!isLoading && prompt.trim()) {
                  e.currentTarget.style.backgroundColor = '#1A1814';
                  e.currentTarget.style.color = '#F9F6F0';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1A1814';
              }}
            >
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <>See what's around →</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Revisit past walks */}
      {hasHistory && (
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button
            onClick={onOpenJournal}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#6B6457',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationColor: '#DDD8CE',
              transition: 'color 180ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
          >
            Revisit past walks
          </button>
        </div>
      )}

      {/* Suggestion pills */}
      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {VIBES.map(vibe => (
          <button
            key={vibe}
            onClick={() => setPrompt(vibe)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#6B6457',
              backgroundColor: 'transparent',
              border: '1px solid #DDD8CE',
              borderRadius: '2px',
              padding: '4px 10px',
              cursor: 'pointer',
              transition: 'border-color 180ms ease, color 180ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1A1814';
              e.currentTarget.style.color = '#1A1814';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#DDD8CE';
              e.currentTarget.style.color = '#6B6457';
            }}
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JourneyInput;
