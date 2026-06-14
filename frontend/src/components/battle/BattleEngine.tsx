/**
 * ⚔️ LUNTIAN ANGLARO — Battle Simulator
 * Mini turn-based battle system
 */

import { useState, useEffect, useCallback } from 'react';
import { ELEMENT_CONFIG } from '@/types/game.types';
import type { Guardian, General } from '@/types/game.types';

interface BattleEngineProps {
  guardian: Guardian;
  general: General;
  language: 'en' | 'fil';
  onBattleEnd: (won: boolean, stats: BattleStats) => void;
  onExit: () => void;
}

interface BattleStats {
  damageDealt: number;
  damageTaken: number;
  turnsPlayed: number;
  powersUsed: string[];
}

interface BattleLog {
  turn: number;
  actor: 'guardian' | 'general';
  action: string;
  damage: number;
  message: string;
}

// Element effectiveness chart
const ELEMENT_EFFECTIVENESS: Record<string, Record<string, number>> = {
  NATURE: { AIR: 1.5, WATER: 0.8, MINING: 1.0, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0 },
  WATER:  { AIR: 1.0, WATER: 1.5, MINING: 0.8, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0 },
  EARTH:  { AIR: 0.8, WATER: 1.0, MINING: 1.5, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0 },
  WIND:   { AIR: 1.0, WATER: 1.0, MINING: 1.0, FOREST: 1.5, OCEAN: 0.8, FINAL: 1.0 },
  MARINE: { AIR: 1.0, WATER: 1.0, MINING: 1.0, FOREST: 0.8, OCEAN: 1.5, FINAL: 1.0 },
};

const BattleEngine = ({ guardian, general, language, onBattleEnd, onExit }: BattleEngineProps) => {
  const [guardianHP, setGuardianHP] = useState(100);
  const [generalHP, setGeneralHP] = useState(100);
  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [stats, setStats] = useState<BattleStats>({
    damageDealt: 0, damageTaken: 0, turnsPlayed: 0, powersUsed: [],
  });
  const [shakeGuardian, setShakeGuardian] = useState(false);
  const [shakeGeneral, setShakeGeneral] = useState(false);

  const config = ELEMENT_CONFIG[guardian.element];
  const effectiveness = ELEMENT_EFFECTIVENESS[guardian.element]?.[general.threat_type] || 1.0;

  const addLog = useCallback((entry: BattleLog) => {
    setBattleLog((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  // General's turn (AI)
  const generalAttack = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      const baseDamage = 8 + Math.floor(Math.random() * 12);
      const isCrit = Math.random() < 0.15;
      const damage = isCrit ? Math.floor(baseDamage * 1.5) : baseDamage;

      setGuardianHP((prev) => Math.max(0, prev - damage));
      setShakeGuardian(true);
      setTimeout(() => setShakeGuardian(false), 500);

      setStats((prev) => ({ ...prev, damageTaken: prev.damageTaken + damage }));

      addLog({
        turn,
        actor: 'general',
        action: isCrit ? 'Critical Attack!' : 'Attack',
        damage,
        message: language === 'en'
          ? `${general.display_name} ${isCrit ? 'lands a CRITICAL HIT for' : 'attacks for'} ${damage} damage!`
          : `${general.display_name} ${isCrit ? 'nag-CRITICAL HIT ng' : 'umatake ng'} ${damage} na pinsala!`,
      });

      setTurn((prev) => prev + 1);
      setIsPlayerTurn(true);
      setIsAnimating(false);
    }, 1000);
  }, [general, turn, language, addLog]);

  // Check battle end
  useEffect(() => {
    if (battleOver) return;
    if (guardianHP <= 0) {
      setBattleOver(true);
      onBattleEnd(false, stats);
    } else if (generalHP <= 0) {
      setBattleOver(true);
      onBattleEnd(true, stats);
    } else if (!isPlayerTurn && !isAnimating) {
      generalAttack();
    }
  }, [guardianHP, generalHP, isPlayerTurn, isAnimating, battleOver, generalAttack, onBattleEnd, stats]);

  // Player attacks
  const playerAttack = (power: string, index: number) => {
    if (!isPlayerTurn || isAnimating || battleOver) return;
    setIsAnimating(true);

    setTimeout(() => {
      const baseMultipliers = [1.0, 1.2, 1.5]; // power_1 < power_2 < power_3
      const baseDamage = 10 + Math.floor(Math.random() * 10);
      const multiplied = Math.floor(baseDamage * baseMultipliers[index] * effectiveness);
      const isCrit = Math.random() < 0.2;
      const damage = isCrit ? Math.floor(multiplied * 1.5) : multiplied;

      setGeneralHP((prev) => Math.max(0, prev - damage));
      setShakeGeneral(true);
      setTimeout(() => setShakeGeneral(false), 500);

      setStats((prev) => ({
        ...prev,
        damageDealt: prev.damageDealt + damage,
        turnsPlayed: prev.turnsPlayed + 1,
        powersUsed: [...prev.powersUsed, power],
      }));

      let effectMsg = '';
      if (effectiveness > 1) effectMsg = language === 'en' ? ' (Super Effective!)' : ' (Sobrang Epektibo!)';
      if (effectiveness < 1) effectMsg = language === 'en' ? ' (Not Very Effective...)' : ' (Hindi Masyadong Epektibo...)';

      addLog({
        turn,
        actor: 'guardian',
        action: power,
        damage,
        message: language === 'en'
          ? `${guardian.display_name} uses ${power} for ${damage} damage!${effectMsg}${isCrit ? ' CRITICAL!' : ''}`
          : `Ginamit ni ${guardian.display_name} ang ${power} ng ${damage} na pinsala!${effectMsg}${isCrit ? ' CRITICAL!' : ''}`,
      });

      setIsPlayerTurn(false);
      setIsAnimating(false);
    }, 500);
  };

  const hpBarColor = (hp: number) => {
    if (hp > 60) return '#4CAF50';
    if (hp > 30) return '#FFD600';
    return '#EF5350';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Battle Header */}
      <div className="text-center mb-6">
        <div className="text-xs text-[var(--luntian-text-muted)] uppercase tracking-widest mb-1">
          {language === 'en' ? 'Turn' : 'Turno'} {turn}
        </div>
        {effectiveness > 1 && (
          <div className="text-xs text-green-400">⚡ {language === 'en' ? 'Element Advantage!' : 'Bentahe ng Elemento!'}</div>
        )}
        {effectiveness < 1 && (
          <div className="text-xs text-red-400">⚠️ {language === 'en' ? 'Element Disadvantage' : 'Disbentahe ng Elemento'}</div>
        )}
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Guardian Side */}
        <div className={`text-center transition-transform duration-300 ${shakeGuardian ? 'animate-pulse scale-95' : ''}`}>
          <div
            className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl border-2 mb-3"
            style={{
              backgroundColor: `${config.bgColor}33`,
              borderColor: `${config.color}66`,
              boxShadow: guardianHP > 0 ? `0 0 15px ${config.color}33` : 'none',
              opacity: guardianHP > 0 ? 1 : 0.4,
            }}
          >
            {config.emoji}
          </div>
          <h3 className="font-bold" style={{ color: config.color }}>
            {guardian.display_name}
          </h3>
          <div className="text-xs text-[var(--luntian-text-muted)]">{guardian.element_display}</div>

          {/* HP Bar */}
          <div className="mt-3 mx-auto max-w-[200px]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--luntian-text-muted)]">HP</span>
              <span style={{ color: hpBarColor(guardianHP) }}>{guardianHP}/100</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${guardianHP}%`,
                  backgroundColor: hpBarColor(guardianHP),
                  boxShadow: `0 0 6px ${hpBarColor(guardianHP)}66`,
                }}
              />
            </div>
          </div>
        </div>

        {/* VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--luntian-text-muted)]/30 hidden md:block">
          VS
        </div>

        {/* General Side */}
        <div className={`text-center transition-transform duration-300 ${shakeGeneral ? 'animate-pulse scale-95' : ''}`}>
          <div
            className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl border-2 border-red-800/50 bg-red-950/30 mb-3"
            style={{
              boxShadow: generalHP > 0 ? '0 0 15px #EF535033' : 'none',
              opacity: generalHP > 0 ? 1 : 0.4,
            }}
          >
            💀
          </div>
          <h3 className="font-bold text-red-400">{general.display_name}</h3>
          <div className="text-xs text-red-300/60">{general.threat_display}</div>

          {/* HP Bar */}
          <div className="mt-3 mx-auto max-w-[200px]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--luntian-text-muted)]">HP</span>
              <span style={{ color: hpBarColor(generalHP) }}>{generalHP}/100</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${generalHP}%`,
                  backgroundColor: hpBarColor(generalHP),
                  boxShadow: `0 0 6px ${hpBarColor(generalHP)}66`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!battleOver && isPlayerTurn && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[guardian.power_1, guardian.power_2, guardian.power_3].map((power, i) => (
            <button
              key={i}
              onClick={() => playerAttack(power, i)}
              disabled={isAnimating}
              className="p-3 rounded-xl border transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${config.color}15`,
                borderColor: `${config.color}44`,
              }}
            >
              <div className="font-bold text-sm" style={{ color: config.color }}>
                {power}
              </div>
              <div className="text-[10px] text-[var(--luntian-text-muted)] mt-1">
                {['Normal', 'Strong', 'Ultimate'][i]} • x{[1.0, 1.2, 1.5][i]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Waiting indicator */}
      {!battleOver && !isPlayerTurn && (
        <div className="text-center mb-6 animate-pulse">
          <span className="text-sm text-red-400">
            💀 {general.display_name} {language === 'en' ? 'is attacking...' : 'umaatake...'}
          </span>
        </div>
      )}

      {/* Battle Over */}
      {battleOver && (
        <div className="text-center mb-6 rounded-2xl p-8 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
          <div className="text-5xl mb-4">
            {generalHP <= 0 ? '🏆' : '💀'}
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: generalHP <= 0 ? '#4CAF50' : '#EF5350' }}>
            {generalHP <= 0
              ? (language === 'en' ? 'VICTORY!' : 'TAGUMPAY!')
              : (language === 'en' ? 'DEFEATED...' : 'NATALO...')}
          </h2>
          <p className="text-[var(--luntian-text-muted)] mb-4">
            {generalHP <= 0
              ? (language === 'en'
                ? `${general.display_name} has been defeated! The environment heals.`
                : `Natalo na si ${general.display_name}! Gumagaling ang kalikasan.`)
              : (language === 'en'
                ? 'The pollution grows stronger... Try again, Guardian.'
                : 'Lumakas pa ang polusyon... Subukan muli, Tagapag-alaga.')}
          </p>

          {/* Battle Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-lg font-bold text-[var(--luntian-primary-light)]">{stats.damageDealt}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Damage Dealt' : 'Pinsalang Binigay'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{stats.damageTaken}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Damage Taken' : 'Pinsalang Tinanggap'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[var(--luntian-gold)]">{stats.turnsPlayed}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">{language === 'en' ? 'Turns' : 'Turno'}</div>
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-6 py-2 rounded-lg bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold transition-all"
          >
            {language === 'en' ? 'Return to Battle Select' : 'Bumalik sa Pagpili ng Laban'}
          </button>
        </div>
      )}

      {/* Battle Log */}
      <div className="rounded-xl border border-[var(--luntian-primary)]/15 bg-[var(--luntian-surface)] max-h-48 overflow-y-auto">
        <div className="px-4 py-2 border-b border-[var(--luntian-primary)]/10 sticky top-0 bg-[var(--luntian-surface)]">
          <span className="text-xs font-semibold text-[var(--luntian-text-muted)]">
            📜 {language === 'en' ? 'Battle Log' : 'Talaan ng Laban'}
          </span>
        </div>
        <div className="p-3 space-y-1">
          {battleLog.length === 0 ? (
            <p className="text-xs text-[var(--luntian-text-muted)]/40 text-center py-4">
              {language === 'en' ? 'Choose your attack to begin!' : 'Pumili ng atake para magsimula!'}
            </p>
          ) : (
            battleLog.map((log, i) => (
              <div
                key={i}
                className={`text-xs px-2 py-1 rounded ${
                  log.actor === 'guardian'
                    ? 'text-[var(--luntian-primary-light)]'
                    : 'text-red-400'
                }`}
              >
                <span className="text-[var(--luntian-text-muted)]/40 mr-2">T{log.turn}</span>
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleEngine;