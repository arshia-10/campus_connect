import React from 'react';
import { STATS, ANALYTICS_BRANCHES, ANALYTICS_PACKAGES } from '../data/jobs';
import Footer from '../components/common/Footer';

export default function AnalyticsPage({ t, dark }) {
  const maxCount = Math.max(...ANALYTICS_PACKAGES.map(p => p.count));

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Placement Analytics
          </h1>
          <p style={{ fontSize: 15, color: t.textMuted }}>AY 2024–25 · Live placement data</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card fade-up" style={{ background: t.surface, border: `1px solid ${t.border}`, animationDelay: `${i * 0.08}s` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.statIcon, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: '#2ea87e' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: t.textMuted }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Branch-wise */}
          <div className="fade-up" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 20 }}>Branch-wise Placement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ANALYTICS_BRANCHES.map(b => (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: t.text }}>{b.label}</span>
                    <span style={{ color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{b.placed}/{b.total}</span>
                  </div>
                  <div style={{ background: t.bgAlt, borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${(b.placed / b.total) * 100}%`, background: b.color, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: t.textFaint, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>
                    {Math.round((b.placed / b.total) * 100)}% placement rate
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package distribution */}
          <div className="fade-up" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '24px', animationDelay: '0.1s' }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 20 }}>Package Distribution</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
              {ANALYTICS_PACKAGES.map(p => (
                <div key={p.range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: p.color }}>{p.count}</span>
                  <div style={{ width: '100%', borderRadius: '6px 6px 0 0', height: `${(p.count / maxCount) * 100}%`, background: p.color, opacity: 0.85 }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {ANALYTICS_PACKAGES.map(p => (
                <div key={p.range} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: t.textMuted, lineHeight: 1.3 }}>{p.range}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="fade-up" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '24px', animationDelay: '0.15s' }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 20 }}>Placement Timeline</h3>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {[
              { month: 'Aug', drives: 4, placed: 42,  color: '#3b6fd4' },
              { month: 'Sep', drives: 8, placed: 115, color: '#2ea87e' },
              { month: 'Oct', drives: 12,placed: 198, color: '#2ea87e' },
              { month: 'Nov', drives: 9, placed: 163, color: '#f59e0b' },
              { month: 'Dec', drives: 6, placed: 89,  color: '#3b6fd4' },
              { month: 'Jan', drives: 7, placed: 112, color: '#2ea87e' },
              { month: 'Feb', drives: 5, placed: 74,  color: '#8b5cf6' },
              { month: 'Mar', drives: 3, placed: 54,  color: '#ef4444' },
            ].map(m => (
              <div key={m.month} style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.placed}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>placed</div>
                <div style={{ background: m.color, borderRadius: 6, height: `${(m.placed / 198) * 100}px`, minHeight: 4, margin: '0 auto', width: '60%', opacity: 0.8 }} />
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginTop: 8 }}>{m.month}</div>
                <div style={{ fontSize: 11, color: t.textFaint }}>{m.drives} drives</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer dark={dark} t={t} />
    </div>
  );
}
