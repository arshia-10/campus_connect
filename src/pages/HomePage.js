import React from 'react';
import HeroSection        from '../components/home/HeroSection';
import StatsRow           from '../components/home/StatsRow';
import FeaturedRecruiters from '../components/home/FeaturedRecruiters';
import Footer             from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ t, dark, setPage, onLogin }) {
  const { user } = useAuth();

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <HeroSection setPage={setPage} user={user} onLogin={onLogin} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
        <StatsRow t={t} />
        <FeaturedRecruiters t={t} setPage={setPage} />
      </div>

      {/* CTA */}
      {!user && (
        <section style={{ background: '#1a3a5c', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>
            Ready to Launch Your Career?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
            Join 847+ placed students from our campus.
          </p>
          <button className="btn btn-accent btn-lg" onClick={onLogin}
            style={{ boxShadow: '0 4px 20px rgba(46,168,126,0.45)' }}>
            Get Started Free
          </button>
        </section>
      )}

      <Footer dark={dark} t={t} />
    </div>
  );
}
