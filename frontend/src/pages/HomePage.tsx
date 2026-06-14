/**
 * 🌿 LUNTIAN ANGLARO — Home Page
 * Now powered by LIVE API data!
 */

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store';
import { ELEMENT_CONFIG } from '@/types/game.types';

const HomePage = () => {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const {
    initialize,
    isLoading,
    isInitialized,
    error,
    health,
    guardians,
    generals,
    regions,
    achievements,
    language,
  } = useGameStore();


  // Initialize game data on mount
// Force initialize on mount
  useEffect(() => {
    if (!isInitialized) initialize()
  }, [initialize, isInitialized])

  // Don't block render if data takes too long
  // The page will render with whatever data is available

  // Glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: 'var(--luntian-primary-light)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      
      {/* Hero Section */}
      <div className="relative z-10 text-center px-6 pt-10">
        <div
          className="text-7xl mb-6 inline-block"
          style={{
            filter: `drop-shadow(0 0 ${10 + Math.sin(glowIntensity * 0.05) * 5}px var(--luntian-primary-light))`,
          }}
        >
          🌿
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">
          <span className="text-[var(--luntian-primary-light)]">LUNTIAN</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-1 tracking-[0.3em] uppercase text-[var(--luntian-text-muted)]">
          Ang Laro
        </h2>
        <p className="text-sm md:text-base text-[var(--luntian-text-muted)] mb-4 italic">
          Guardians of the Environment
        </p>

        <p className="text-lg md:text-xl text-[var(--luntian-gold)] font-medium mb-8">
          "Luntiang Puso, Luntiang Gawa"
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="px-8 py-3 bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_var(--luntian-primary)]">
            ⚔️ {language === 'en' ? 'Play' : 'Maglaro'}
          </button>
          <button className="px-8 py-3 border border-[var(--luntian-primary)] text-[var(--luntian-primary-light)] hover:bg-[var(--luntian-primary)]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            📖 {language === 'en' ? 'The Story' : 'Ang Kwento'}
          </button>
        </div>

        {/* API Status */}
        {isLoading && (
          <div className="text-[var(--luntian-text-muted)] animate-pulse mb-6">
            🌿 {language === 'en' ? 'Connecting to Luntian servers...' : 'Kumokonekta sa server ng Luntian...'}
          </div>
        )}

        {error && (
          <div className="text-[var(--luntian-danger)] mb-6 px-4 py-2 rounded-lg bg-red-900/20 border border-red-800 inline-block">
            ⚠️ {error}
            <p className="text-xs mt-1 text-[var(--luntian-text-muted)]">
              {language === 'en' ? 'Is the Django server running on port 8000?' : 'Tumatakbo ba ang Django server sa port 8000?'}
            </p>
          </div>
        )}

        {/* Live Game Data Cards */}
        {isInitialized && (
          <div className="max-w-5xl mx-auto">
            {/* Health Badge */}
            {health && (
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-900/30 border border-green-700 text-green-400 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {health?.game || 'LUNTIAN ANGLARO'} v{health?.version || '0.1.0'} — {health?.status?.toUpperCase() || 'OFFLINE'}
              </div>
            )}

            {/* Guardians Row */}
            <h3 className="text-lg font-semibold text-[var(--luntian-text-muted)] mb-4 tracking-wide">
              🛡️ {language === 'en' ? 'THE GUARDIANS' : 'ANG MGA TAGAPAG-ALAGA'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
              {(guardians || []).map((g) => {
                const config = ELEMENT_CONFIG[g.element];
                return (
                  <div
                    key={g.id}
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: `${config.bgColor}22`,
                      borderColor: `${config.color}44`,
                    }}
                  >
                    <div className="text-3xl mb-2">{config.emoji}</div>
                    <div className="font-bold text-sm" style={{ color: config.color }}>
                      {g.display_name}
                    </div>
                    <div className="text-xs text-[var(--luntian-text-muted)]">
                      {g.combat_role_display}
                    </div>
                    <div className="text-[10px] text-[var(--luntian-text-muted)]/60 mt-1">
                      Ch.{g.awakening_chapter} • {g.region_name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generals Row */}
            <h3 className="text-lg font-semibold text-[var(--luntian-text-muted)] mb-4 tracking-wide">
              💀 {language === 'en' ? 'THE GENERALS OF POLLUTION' : 'ANG MGA HENERAL NG POLUSYON'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
              {(generals || []).map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl p-3 border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="font-bold text-sm text-red-400">
                    {g.display_name}
                  </div>
                  <div className="text-xs text-red-300/60">
                    {g.threat_display}
                  </div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]/50 mt-1">
                    Ch.{g.chapter_number} • {g.battle_phases} phases
                  </div>
                </div>
              ))}
            </div>

            {/* Regions Row */}
            <h3 className="text-lg font-semibold text-[var(--luntian-text-muted)] mb-4 tracking-wide">
              🗺️ {language === 'en' ? 'REGIONS' : 'MGA REHIYON'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
              {(regions || []).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-3 border border-[var(--luntian-primary)]/30 bg-[var(--luntian-surface)] hover:bg-[var(--luntian-primary)]/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="font-bold text-sm text-[var(--luntian-primary-light)]">
                    {language === 'fil' && r.name_filipino ? r.name_filipino : r.name}
                  </div>
                  <div className="text-xs text-[var(--luntian-text-muted)]">
                    Saga {r.saga} • Ch.{r.chapter_number}
                  </div>
                  {r.guardian_name && (
                    <div className="text-[10px] text-[var(--luntian-gold)] mt-1">
                      🛡️ {r.guardian_name}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 py-4 px-6 rounded-xl bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luntian-primary-light)]">{guardians.length}</div>
                <div className="text-xs text-[var(--luntian-text-muted)]">Guardians</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{generals.length}</div>
                <div className="text-xs text-[var(--luntian-text-muted)]">Generals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luntian-sky)]">{regions.length}</div>
                <div className="text-xs text-[var(--luntian-text-muted)]">Regions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--luntian-gold)]">{achievements.length}</div>
                <div className="text-xs text-[var(--luntian-text-muted)]">Achievements</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;