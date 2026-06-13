import { useEffect } from 'react';
import { useGameStore } from '@/store';

const THREAT_CONFIG: Record<string, { emoji: string; color: string }> = {
  AIR: { emoji: '💨', color: '#78909C' },
  WATER: { emoji: '🏭', color: '#5C6BC0' },
  MINING: { emoji: '⛏️', color: '#8D6E63' },
  FOREST: { emoji: '🪓', color: '#66BB6A' },
  OCEAN: { emoji: '🌊', color: '#26C6DA' },
  CORRUPT: { emoji: '🏛️', color: '#FFA726' },
  FINAL: { emoji: '☠️', color: '#EF5350' },
};

const GeneralsPage = () => {
  const { generals, guardians, initialize, isInitialized, language } = useGameStore();

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-400 mb-2">
        💀 {language === 'en' ? 'The Generals of Pollution' : 'Ang Mga Heneral ng Polusyon'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'The dark forces destroying the Philippine environment. Each must be defeated.'
          : 'Ang madidilim na pwersa na sumisira sa kalikasan ng Pilipinas. Kailangang talunin bawat isa.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generals.map((g) => {
          const threat = THREAT_CONFIG[g.threat_type] || { emoji: '💀', color: '#EF5350' };
          const weakGuardian = guardians.find((gd) => gd.element === g.weakness_element);

          return (
            <div
              key={g.id}
              className="rounded-2xl p-6 border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{threat.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: threat.color }}>
                    {g.display_name}
                  </h2>
                  <span className="text-xs text-red-300/60">
                    {g.threat_display}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--luntian-text-muted)] mb-4">
                {language === 'fil' && g.description_filipino
                  ? g.description_filipino
                  : g.description}
              </p>

              {/* Battle Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg p-2 bg-black/20 text-center">
                  <div className="text-lg font-bold text-red-400">{g.battle_phases}</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">Battle Phases</div>
                </div>
                <div className="rounded-lg p-2 bg-black/20 text-center">
                  <div className="text-lg font-bold text-[var(--luntian-gold)]">Saga {g.saga}</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">Chapter {g.chapter_number}</div>
                </div>
              </div>

              {/* Weakness */}
              {weakGuardian && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-green-900/20 border border-green-800/30">
                  <span>⚡ {language === 'en' ? 'Weak to' : 'Mahina sa'}:</span>
                  <span className="font-bold text-[var(--luntian-primary-light)]">
                    {weakGuardian.display_name} ({weakGuardian.element_display})
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-[var(--luntian-text-muted)]/60 pt-3 mt-3 border-t border-white/5">
                <span>📍 {g.region_name || 'Unknown Realm'}</span>
                <span className={g.name === 'ang_dumi' ? 'text-red-400 font-bold' : ''}>
                  {g.name === 'ang_dumi' ? '👑 FINAL BOSS' : `Ch.${g.chapter_number}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralsPage;