/**
 * ⚔️ LUNTIAN ANGLARO — Battle Page
 * Select a Guardian and General, then fight!
 */

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store';
import { ELEMENT_CONFIG } from '@/types/game.types';
/**import BattleEngine from '@/components/battle/BattleEngine';*/
import type { Guardian, General } from '@/types/game.types';
import { toast } from 'sonner';
import Battle3DArena from '@/components/battle3d/Battle3DArena';

const BattlePage = () => {
  const { guardians, generals, initialize, isInitialized, language } = useGameStore();
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [selectedGeneral, setSelectedGeneral] = useState<General | null>(null);
  const [inBattle, setInBattle] = useState(false);

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  const startBattle = () => {
    if (selectedGuardian && selectedGeneral) {
      setInBattle(true);
    }
  };

  const handleBattleEnd = (won: boolean) => {
    if (won) {
      toast.success(
        language === 'en'
          ? `🏆 Victory! ${selectedGeneral?.display_name} has been defeated!`
          : `🏆 Tagumpay! Natalo si ${selectedGeneral?.display_name}!`,
        { duration: 5000 }
      );
    } else {
      toast.error(
        language === 'en'
          ? `💀 Defeated by ${selectedGeneral?.display_name}. Try again!`
          : `💀 Natalo ni ${selectedGeneral?.display_name}. Subukan muli!`,
        { duration: 5000 }
      );
    }
  };

  const exitBattle = () => {
    setInBattle(false);
    setSelectedGuardian(null);
    setSelectedGeneral(null);
  };

  // ── 3D Battle Mode ──
  if (inBattle && selectedGuardian && selectedGeneral) {
    return (
      <div className="p-6">
        <Battle3DArena
          guardian={selectedGuardian}
          general={selectedGeneral}
          language={language}
          onBattleEnd={handleBattleEnd}
          onExit={exitBattle}
        />
      </div>
    );
  }

  // Selection mode
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-400 mb-2">
        ⚔️ {language === 'en' ? 'Battle Simulator' : 'Simulator ng Laban'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'Choose your Guardian and face a General in combat!'
          : 'Pumili ng iyong Tagapag-alaga at harapin ang isang Heneral sa laban!'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guardian Selection */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--luntian-primary-light)] mb-4">
            🛡️ {language === 'en' ? 'Select Guardian' : 'Pumili ng Tagapag-alaga'}
          </h2>
          <div className="space-y-3">
            {(guardians || []).map((g) => {
              const c = ELEMENT_CONFIG[g.element];
              const isSelected = selectedGuardian?.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuardian(g)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${c.bgColor}33` : `${c.bgColor}11`,
                    borderColor: isSelected ? c.color : `${c.color}33`,
                    boxShadow: isSelected ? `0 0 15px ${c.color}22` : 'none',
                  }}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: c.color }}>{g.display_name}</div>
                    <div className="text-xs text-[var(--luntian-text-muted)]">
                      {g.element_display} • {g.combat_role_display}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--luntian-text-muted)]">
                    <div>{g.power_1}</div>
                    <div>{g.power_2}</div>
                    <div>{g.power_3}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* General Selection */}
        <div>
          <h2 className="text-lg font-semibold text-red-400 mb-4">
            💀 {language === 'en' ? 'Select General' : 'Pumili ng Heneral'}
          </h2>
          <div className="space-y-3">
            {(generals || []).map((g) => {
              const isSelected = selectedGeneral?.id === g.id;
              const weakGuardian = guardians.find((gd) => gd.element === g.weakness_element);
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGeneral(g)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'border-red-500 bg-red-950/40 scale-[1.02]'
                      : 'border-red-900/30 bg-red-950/15 hover:bg-red-950/25 hover:scale-[1.01]'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 0 15px #EF535022' : 'none',
                  }}
                >
                  <span className="text-3xl">💀</span>
                  <div className="flex-1">
                    <div className="font-bold text-red-400">{g.display_name}</div>
                    <div className="text-xs text-red-300/60">{g.threat_display}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-[var(--luntian-text-muted)]">{g.battle_phases} phases</div>
                    {weakGuardian && (
                      <div className="text-green-400/60">
                        ⚡ {weakGuardian.display_name}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start Battle Button */}
      <div className="mt-8 text-center">
        <button
          onClick={startBattle}
          disabled={!selectedGuardian || !selectedGeneral}
          className="px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: selectedGuardian && selectedGeneral
              ? 'linear-gradient(135deg, #2E7D32, #C62828)'
              : '#333',
            color: 'white',
            boxShadow: selectedGuardian && selectedGeneral
              ? '0 0 30px rgba(198, 40, 40, 0.3)'
              : 'none',
          }}
        >
          {selectedGuardian && selectedGeneral
            ? `⚔️ ${selectedGuardian.display_name} vs ${selectedGeneral.display_name} — ${language === 'en' ? 'FIGHT!' : 'LABAN!'}`
            : `⚔️ ${language === 'en' ? 'Select both to fight' : 'Pumili ng dalawa para lumaban'}`}
        </button>
      </div>
    </div>
  );
};

export default BattlePage;