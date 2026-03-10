import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('cc_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('cc_theme', dark ? 'dark' : 'light');
    document.body.style.background = dark ? '#0d1117' : '#f8fafc';
  }, [dark]);

  const toggle = () => setDark(d => !d);

  // Semantic color tokens
  const t = dark ? {
    bg:         '#0d1117',
    bgAlt:      '#111827',
    surface:    '#111827',
    surfaceAlt: '#1a2235',
    border:     '#1f2d45',
    borderAlt:  '#2a3550',
    text:       '#e2e8f0',
    textMuted:  '#9ca3af',
    textFaint:  '#4b5563',
    input:      '#1e2535',
    inputBorder:'#2a3550',
    navActive:  'rgba(255,255,255,0.08)',
    hover:      'rgba(255,255,255,0.05)',
    tagBg:      '#1e3060',
    tagText:    '#7baaf7',
    statIcon:   'rgba(46,168,126,0.12)',
  } : {
    bg:         '#f8fafc',
    bgAlt:      '#f1f5f9',
    surface:    '#ffffff',
    surfaceAlt: '#f8fafc',
    border:     '#e8edf5',
    borderAlt:  '#dde4ef',
    text:       '#1a2236',
    textMuted:  '#64748b',
    textFaint:  '#9ca3af',
    input:      '#ffffff',
    inputBorder:'#dde4ef',
    navActive:  '#f1f5f9',
    hover:      'rgba(0,0,0,0.04)',
    tagBg:      '#f0f4ff',
    tagText:    '#3b6fd4',
    statIcon:   '#e6f7f1',
  };

  return { dark, toggle, t };
}
