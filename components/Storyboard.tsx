// components/Storyboard.tsx
// Past moments grid — white cards on parchment, editorial type, no blue.

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
    const text = `A collection of moments co-created with Nearby:\n\n"${plan.introduction}"\n\nStops:\n${plan.steps
      .map(s => `• ${s.destination.name}`)
      .join('\n')}\n\nExplore at ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Nearby Storyboard', text, url: window.location.origin });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Take a look at my walk with Nearby:\n\n"${plan.introduction}"\n\n${plan.steps
      .map(s => `• ${s.destination.name}`)
      .join('\n')}\n\nStart your own journey: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2
          className="font-serif-italic"
          style={{ fontSize: '36px', color: '#1A1814', marginBottom: '12px' }}
        >
          Past Moments
        </h2>
        <p
          className="font-serif-italic"
          style={{ fontSize: '15px', color: '#6B6457' }}
        >
          A collection of things noticed on your walk.
        </p>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <button
            onClick={handleShare}
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
          >
            <i className="fa-solid fa-share-nodes"></i>
            {shareStatus === 'copied' ? 'Copied' : 'Share Story'}
          </button>
          <button
            onClick={shareOnWhatsApp}
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
          >
            <i className="fa-brands fa-whatsapp"></i>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        {plan.steps.map((step, idx) => (
          <div key={idx}>
            <div
              style={{
                aspectRatio: '1 / 1',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDD8CE',
                borderRadius: '4px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'border-color 180ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#A09888')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#DDD8CE')}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  fontWeight: 500,
                  color: '#1A1814',
                  opacity: 0.45,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {step.destination.location}
              </span>
              <h4
                className="font-serif-italic"
                style={{ fontSize: '24px', color: '#1A1814', marginBottom: '16px' }}
              >
                {step.destination.name}
              </h4>
              <p
                className="font-serif-italic"
                style={{ fontSize: '14px', color: '#6B6457', lineHeight: 1.6 }}
              >
                "{step.destination.description}"
              </p>
            </div>

            <div style={{ padding: '16px 4px', textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  fontWeight: 500,
                  color: '#1A1814',
                  opacity: 0.45,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                }}
              >
                A detail remembered
              </p>
              <p
                className="font-serif-italic"
                style={{ fontSize: '13px', color: '#6B6457', lineHeight: 1.6 }}
              >
                "{step.destination.sensoryDetail}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div
        style={{
          marginTop: '96px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <button
          onClick={onReset}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 400,
            color: '#1A1814',
            backgroundColor: 'transparent',
            border: '1px solid #1A1814',
            borderRadius: '4px',
            padding: '10px 24px',
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
          Look for something new
        </button>

        <button
          onClick={onViewJournal}
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
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A1814')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6457')}
        >
          View all previous walks
        </button>
      </div>
    </div>
  );
};

export default Storyboard;
