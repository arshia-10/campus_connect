import React, { useState } from 'react';
import { AuthProvider }  from './context/AuthContext';
import { JobsProvider }  from './context/JobsContext';
import { useTheme }      from './hooks/useTheme';

import Navbar            from './components/common/Navbar';
import AuthModal         from './components/auth/AuthModal';
import StudentDashboard  from './components/dashboard/StudentDashboard';
import AdminPanel        from './components/admin/AdminPanel';

import HomePage          from './pages/HomePage';
import JobsPage          from './pages/JobsPage';
import CompaniesPage     from './pages/CompaniesPage';
import AnalyticsPage     from './pages/AnalyticsPage';

function AppInner() {
  const { dark, toggle: toggleDark, t } = useTheme();
  const [page,  setPage]  = useState('home');
  const [modal, setModal] = useState(null); // 'login' | 'signup' | null

  const openLogin  = () => setModal('login');
  const openSignup = () => setModal('signup');
  const closeModal = () => setModal(null);

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text }}>
      <Navbar
        page={page} setPage={setPage}
        dark={dark} toggleDark={toggleDark}
        onLogin={openLogin} onSignup={openSignup}
      />

      {page === 'home'      && <HomePage      t={t} dark={dark} setPage={setPage} onLogin={openLogin} />}
      {page === 'jobs'      && <JobsPage      t={t} dark={dark} onNeedLogin={openLogin} />}
      {page === 'companies' && <CompaniesPage t={t} dark={dark} setPage={setPage} />}
      {page === 'analytics' && <AnalyticsPage t={t} dark={dark} />}
      {page === 'dashboard' && <StudentDashboard t={t} dark={dark} setPage={setPage} />}
      {page === 'admin'     && <AdminPanel    t={t} dark={dark} />}

      {modal && (
        <AuthModal
          initialMode={modal}
          onClose={closeModal}
          dark={dark} t={t}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <AppInner />
      </JobsProvider>
    </AuthProvider>
  );
}
