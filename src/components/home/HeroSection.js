import React from 'react';
import { TICKER_ITEMS } from '../../data/jobs';

export default function HeroSection({ setPage, user, onLogin }) {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0d2b52 0%, #0f4a30 100%)',
        padding: '72px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 28,
          }}>
            <span>🎯</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
              Placement Season 2026 is Live
            </span>
          </div>

          <h1 className="fade-up" style={{
            fontSize: 'clamp(36px, 5.5vw, 66px)', fontWeight: 800, color: '#fff',
            lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em',
            animationDelay: '0.08s',
          }}>
            Your Gateway to<br />
            <span style={{ color: '#2ea87e' }}>Dream Careers</span>
          </h1>

          <p className="fade-up" style={{
            fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.72)',
            maxWidth: 520, lineHeight: 1.7, marginBottom: 36,
            animationDelay: '0.14s',
          }}>
            CampusConnect bridges students with top recruiters. Discover opportunities,
            track applications, and launch your career — all in one place.
          </p>

          <div className="fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animationDelay: '0.2s' }}>
            <button className="btn btn-accent btn-lg" onClick={() => setPage('jobs')}
              style={{ boxShadow: '0 4px 20px rgba(46,168,126,0.45)' }}>
              Browse Jobs →
            </button>
            {!user && (
              <button onClick={onLogin} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{
        background: '#1a3a5c', overflow: 'hidden', padding: '10px 0',
      }}>
        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'ticker 30s linear infinite',
        }}>
          {doubled.map((item, i) => (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: 'rgba(255,255,255,0.75)', padding: '0 32px',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              whiteSpace: 'nowrap',
            }}>{item}</span>
          ))}
        </div>
      </div>
    </>
  );
}
