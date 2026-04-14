// components/ItineraryView.tsx
// Results timeline: dotted path connecting discoveries.
// Warm parchment palette — no blue anywhere.

import React, { useState } from 'react';
import { JourneyPlan, ItineraryStep } from '../types';

interface ItineraryViewProps {
  plan: JourneyPlan;
  citations: any[];
  onComplete: () => void;
  onReset: () => void;
  onRefract: (stepIdx: number) => Promise<void>;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({
  plan,
  citations,
  onComplete,
  onReset,
  onRefract,
}) => {
  const [refractingIdx, setRefractingIdx] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const getMapsSearchUrl = (name: string, location: string) => {
    const cleanName = name
      .replace(/^(Lingering near|Discovering|Visiting|At the|Exploring|Checking out|Near)\s+/i, '')
      .trim();
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cleanName + ' ' + location
    )}`;
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
    const text = `A quiet walk co-created with Nearby:\n\n"${plan.introduction}"\n\nStops:\n${plan.steps
      .map(s => `• ${s.destination.name} (${s.destination.location})`)
      .join('\n')}\n\nExplore your own surroundings at ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'A Journey with Nearby', text, url: window.location.origin });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Check out this walk from Nearby:\n\n"${plan.introduction}"\n\n${plan.steps
      .map(s => `• ${s.destination.name}`)
      .join('\n')}\n\nExplore at: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px 80px' }}>

      {/* Introduction quote */}
      <div style={{ textAlign: 'center', marginBottom: '80px', opacity: 1 }}>
        <p
          className="font-serif-italic"
          style={{ fontSize: '22px', color: '#1A1814', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}
        >
          "{plan.introduction}"
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: 'rgba(26,24,20,0.12)',
            transform: 'translateX(-50%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '96px' }}>
          {plan.steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                opacity: refractingIdx === idx ? 0.4 : 1,
                transition: 'opacity 500ms ease',
              }}
            >
              {/* Waypoint dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%)',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor:
                    idx === plan.steps.length - 1 ? '#C4852A' : 'rgba(26,24,20,0.35)',
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  paddingTop: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {/* Time */}
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '9px',
                    fontWeight: 500,
                    color: '#1A1814',
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {step.estimatedTime}
                </span>

                {/* Place name */}
                <div>
                  <h3
                    className="font-serif-italic"
                    style={{ fontSize: '32px', color: '#1A1814', margin: 0, lineHeight: 1.2 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '9px',
                      fontWeight: 400,
                      color: '#1A1814',
                      opacity: 0.45,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      marginTop: '6px',
                    }}
                  >
                    {step.destination.location}
                  </p>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: '#1A1814',
                    lineHeight: 1.75,
                    maxWidth: '420px',
                    margin: 0,
                  }}
                >
                  {step.destination.description}
                </p>

                {/* Sensory detail */}
                <div
                  style={{
                    border: '1px solid #DDD8CE',
                    borderRadius: '4px',
                    padding: '16px 20px',
                    maxWidth: '380px',
                  }}
                >
                  <p
                    className="font-serif-italic"
                    style={{ fontSize: '14px', color: '#6B6457', margin: 0, lineHeight: 1.6 }}
                  >
                    "{step.destination.sensoryDetail}"
                  </p>
                </div>

                {/* Look closer link */}
                <button
                  onClick={() => handleRefract(idx)}
                  disabled={refractingIdx !== null}
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
                  {refractingIdx === idx ? 'Looking closer...' : 'Look closer'}
                </button>

                {/* View on map */}
                <a
                  href={getMapsSearchUrl(step.destination.name, step.destination.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#1A1814',
                    backgroundColor: 'transparent',
                    border: '1px solid #1A1814',
                    borderRadius: '2px',
                    padding: '6px 14px',
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'background-color 180ms ease, color 180ms ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1A1814';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#F9F6F0';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#1A1814';
                  }}
                >
                  View on Map
                </a>

                {/* Narrative bridge between stops */}
                {idx < plan.steps.length - 1 && (
                  <p
                    className="font-serif-italic"
                    style={{
                      fontSize: '14px',
                      color: '#6B6457',
                      maxWidth: '340px',
                      lineHeight: 1.7,
                      marginTop: '8px',
                    }}
                  >
                    {step.narrativeBridge}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion + actions */}
      <div style={{ marginTop: '128px', textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(26,24,20,0.12)',
            margin: '0 auto 40px',
          }}
        />
        <p
          className="font-serif-italic"
          style={{ fontSize: '20px', color: '#1A1814', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 48px' }}
        >
          "{plan.conclusion}"
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={onComplete}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#1A1814',
              backgroundColor: 'transparent',
              border: '1px solid #1A1814',
              borderRadius: '4px',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'background-color 180ms ease, color 180ms ease',
              width: '280px',
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
            Finish & keep notes
          </button>

          <button
            onClick={onReset}
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
            Look for something new
          </button>
        </div>

        {/* Share row */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
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
            {shareStatus === 'copied' ? 'Copied' : 'Share'}
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

      {/* Citations */}
      {citations.length > 0 && (
        <div
          style={{
            marginTop: '96px',
            paddingTop: '40px',
            borderTop: '1px solid #EDE9E2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              color: '#1A1814',
              opacity: 0.45,
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              marginBottom: '20px',
            }}
          >
            Observations verified by
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {citations.map((cite, i) => (
              <a
                key={i}
                href={cite.web?.uri || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px',
                  fontWeight: 400,
                  color: '#6B6457',
                  backgroundColor: 'transparent',
                  border: '1px solid #DDD8CE',
                  borderRadius: '2px',
                  padding: '4px 10px',
                  textDecoration: 'none',
                  transition: 'border-color 180ms ease, color 180ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1A1814';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#1A1814';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#DDD8CE';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#6B6457';
                }}
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
