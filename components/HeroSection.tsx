// components/HeroSection.tsx
// Full-width hero image with editorial text overlay.
// Image occupies right portion; open parchment on left holds the headline.
// No CSS overlay — the image handles its own tonal range naturally.

import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(320px, 70vh, 900px)',
        overflow: 'hidden',
      }}
    >
      {/* Hero image — map illustration, parchment left, city right */}
      <img
        src="/nearby-hero.jpg"
        alt="Explorer's map illustration"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right center',
          display: 'block',
        }}
      />

      {/* Text — floats on the open parchment area (left ~40%) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: '42%',
            paddingLeft: 'clamp(24px, 6vw, 80px)',
            paddingRight: '24px',
            background: 'radial-gradient(ellipse at left center, rgba(249,246,240,0.85) 0%, rgba(249,246,240,0) 65%)',
          }}
          className="hero-text-block"
        >
          <h1
            className="font-serif-italic"
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#1A1814',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Something interesting is closer than you think.
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              color: '#6B6457',
              marginTop: '16px',
              lineHeight: 1.6,
            }}
          >
            Tell me a mood, a detail, or a simple curiosity.
          </p>
        </div>
      </div>

      {/* Mobile: full-width text below image */}
      <style>{`
        @media (max-width: 640px) {
          .hero-text-block {
            max-width: 85% !important;
          }
        }
        @media (max-width: 768px) {
          .hero-text-block {
            background: radial-gradient(
              ellipse 120% 100% at 20% 50%,
              rgba(249,246,240,0.88) 0%,
              rgba(249,246,240,0.70) 45%,
              rgba(249,246,240,0) 75%
            ) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
