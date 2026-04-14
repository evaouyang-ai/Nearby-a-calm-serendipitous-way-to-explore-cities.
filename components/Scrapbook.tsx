// components/Scrapbook.tsx
// Journal overlay — parchment background, foxing-bordered cards, editorial typography.

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
    const text = `A journey from my journal:\n\n"${memory.plan.introduction}"\n\nStops recorded: ${memory.plan.steps
      .map(s => s.destination.name)
      .join(', ')}\n\nExplore at ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({ text, url: window.location.origin });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#F9F6F0',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 300ms ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: '32px 24px 24px',
          borderBottom: '1px solid #EDE9E2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <h2
            className="font-serif-italic"
            style={{ fontSize: '32px', color: '#1A1814', margin: 0 }}
          >
            Journal
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              color: '#1A1814',
              opacity: 0.45,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginTop: '6px',
            }}
          >
            Your past observations
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '36px',
            height: '36px',
            border: '1px solid #DDD8CE',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B6457',
            transition: 'background-color 180ms ease, color 180ms ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1A1814';
            e.currentTarget.style.color = '#F9F6F0';
            e.currentTarget.style.borderColor = '#1A1814';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6B6457';
            e.currentTarget.style.borderColor = '#DDD8CE';
          }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '14px' }}></i>
        </button>
      </div>

      {/* Memory list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {memories.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '120px' }}>
              <p
                className="font-serif-italic"
                style={{ fontSize: '22px', color: '#A09888' }}
              >
                The pages are empty...
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  fontWeight: 500,
                  color: '#1A1814',
                  opacity: 0.4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: '16px',
                }}
              >
                Go for a walk to begin
              </p>
            </div>
          ) : (
            memories.map(memory => (
              <div
                key={memory.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD8CE',
                  borderRadius: '4px',
                  padding: '28px 28px 24px',
                  transition: 'border-color 180ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#A09888')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#DDD8CE')}
              >
                {/* Card header: date + location tags + share */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '10px',
                      fontWeight: 400,
                      color: '#1A1814',
                      opacity: 0.45,
                    }}
                  >
                    {new Date(memory.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleShare(memory)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#A09888',
                        fontSize: '12px',
                        padding: '2px 4px',
                        transition: 'color 180ms ease',
                      }}
                      title="Share this entry"
                      onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A09888')}
                    >
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>

                    {memory.plan.steps.slice(0, 2).map((step, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '10px',
                          fontWeight: 400,
                          color: '#6B6457',
                          border: '1px solid #DDD8CE',
                          borderRadius: '2px',
                          padding: '2px 8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {step.destination.location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p
                  className="font-serif-italic"
                  style={{
                    fontSize: '20px',
                    color: '#1A1814',
                    lineHeight: 1.55,
                    marginBottom: '20px',
                  }}
                >
                  "{memory.plan.introduction}"
                </p>

                {/* First detail */}
                <div
                  style={{
                    backgroundColor: '#F9F6F0',
                    border: '1px solid #EDE9E2',
                    borderRadius: '4px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '9px',
                      fontWeight: 500,
                      color: '#1A1814',
                      opacity: 0.4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '6px',
                    }}
                  >
                    First detail noted
                  </p>
                  <p
                    className="font-serif-italic"
                    style={{ fontSize: '13px', color: '#6B6457', lineHeight: 1.6 }}
                  >
                    "{memory.plan.steps[0]?.destination.sensoryDetail}"
                  </p>
                </div>

                {/* Footer: moments count + open walk */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #EDE9E2',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#1A1814',
                      opacity: 0.45,
                    }}
                  >
                    {memory.plan.steps.length} moments recorded
                  </span>

                  <button
                    onClick={() => onRevisit(memory)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#6B6457',
                      opacity: 0.7,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      transition: 'color 180ms ease, opacity 180ms ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#1A1814';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#6B6457';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    Open Walk →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid #EDE9E2',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            color: '#1A1814',
            opacity: 0.35,
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
          }}
        >
          Nearby Archive — Co-created with Eve
        </p>
      </div>
    </div>
  );
};

export default Scrapbook;
