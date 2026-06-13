import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useGameStore } from '@/store';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home', labelFil: 'Tahanan' },
  { path: '/guardians', icon: '🛡️', label: 'Guardians', labelFil: 'Mga Tagapag-alaga' },
  { path: '/generals', icon: '💀', label: 'Generals', labelFil: 'Mga Heneral' },
  { path: '/regions', icon: '🗺️', label: 'Regions', labelFil: 'Mga Rehiyon' },
  { path: '/achievements', icon: '🏆', label: 'Achievements', labelFil: 'Mga Tagumpay' },
  { path: '/leaderboard', icon: '📊', label: 'Leaderboard', labelFil: 'Ranggo' },
  { path: '/codex', icon: '📚', label: 'Codex', labelFil: 'Eskwelahan' },
];

const AppLayout = () => {
  const { language, toggleLanguage, health } = useGameStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--luntian-bg)]">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen flex flex-col border-r border-[var(--luntian-primary)]/20 bg-[var(--luntian-surface)] transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[var(--luntian-primary)]/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-[var(--luntian-primary-light)] leading-tight">
                  LUNTIAN
                </h1>
                <span className="text-[10px] text-[var(--luntian-text-muted)]">Ang Laro</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--luntian-primary)]/20 text-[var(--luntian-primary-light)] font-semibold'
                    : 'text-[var(--luntian-text-muted)] hover:bg-[var(--luntian-primary)]/10 hover:text-[var(--luntian-text)]'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && (
                <span>{language === 'fil' ? item.labelFil : item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--luntian-primary)]/20 space-y-2">
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs text-[var(--luntian-text-muted)] hover:bg-[var(--luntian-primary)]/10 transition-all"
          >
            {sidebarCollapsed ? '▶' : '◀'}
            {!sidebarCollapsed && <span>{language === 'en' ? 'Collapse' : 'Liitan'}</span>}
          </button>

          {/* Health Status */}
          {!sidebarCollapsed && health && (
            <div className="flex items-center gap-1.5 text-[10px] text-green-400/60 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              v{health.version}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-[var(--luntian-primary)]/20 bg-[var(--luntian-bg)]/80 backdrop-blur-md">
          <div className="text-sm text-[var(--luntian-text-muted)]">
            <span className="text-[var(--luntian-gold)] italic">"Luntiang Puso, Luntiang Gawa"</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 text-xs rounded-full border border-[var(--luntian-primary)]/40 text-[var(--luntian-text-muted)] hover:bg-[var(--luntian-primary)]/20 transition-all"
          >
            {language === 'en' ? '🇵🇭 Filipino' : '🇺🇸 English'}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-[var(--luntian-primary)]/10 text-center text-[10px] text-[var(--luntian-text-muted)]/40">
          v0.1.0 — LUNTIAN ANGLARO • Built with 💚 by Sensei & Master
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;