import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const [tab, setTab] = useState('home');

  return (
    <div className="app">
      {tab === 'home' ? <HomePage /> : <SettingsPage />}
      <nav className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'home'} onClick={() => setTab('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" />
          </svg>홈
        </button>
        <button role="tab" aria-selected={tab === 'settings'} onClick={() => setTab('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
          </svg>설정
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
