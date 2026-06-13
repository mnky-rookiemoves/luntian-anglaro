/**
 * 🗺️ Region Detail Panel — Shows region info + Kalikasan Engine meters
 */

import type { Region, Guardian, General } from '@/types/game.types';
import { ELEMENT_CONFIG } from '@/types/game.types';

interface RegionDetailProps {
  region: Region;
  guardian?: Guardian;
  general?: General;
  language: 'en' | 'fil';
  onClose: () => void;
}

const KALIKASAN_METERS = [
  { key: 'FOREST', emoji: '🌳', label: 'Forest Health', labelFil: 'Kalusugan ng Kagubatan', value: 0 },
  { key: 'WATER', emoji: '💧', label: 'Water Purity', labelFil: 'Kadalisayan ng Tubig', value: 0 },
  { key: 'AIR', emoji: '🌬️', label: 'Air Quality', labelFil: 'Kalidad ng Hangin', value: 0 },
  { key: 'WILDLIFE', emoji: '🐾', label: 'Wildlife', labelFil: 'Populasyon ng Hayop', value: 0 },
];

// Default meter values per region (initial game state)
const REGION_METERS: Record<string, number[]> = {
  HUB: [80, 75, 70, 85],       // Hub is relatively healthy
  NCR: [15, 20, 10, 25],       // Metro Manila is heavily polluted
  MNL_BAY: [30, 8, 35, 20],    // Manila Bay — water is terrible
  CAR: [45, 35, 60, 40],       // Cordillera — mining damage
  MIN_FOR: [25, 55, 65, 15],   // Mindanao — deforestation
  TUB: [60, 30, 70, 25],       // Tubbataha — ocean pollution
};

const getMeterColor = (value: number) => {
  if (value <= 25) return '#616161';   // DEAD
  if (value <= 50) return '#795548';   // DYING
  if (value <= 75) return '#4CAF50';   // HEALING
  return '#FFD600';                     // THRIVING
};

const getMeterLabel = (value: number, lang: 'en' | 'fil') => {
  if (value <= 25) return lang === 'en' ? 'Dead' : 'Patay';
  if (value <= 50) return lang === 'en' ? 'Dying' : 'Namamatay';
  if (value <= 75) return lang === 'en' ? 'Healing' : 'Gumagaling';
  return lang === 'en' ? 'Thriving' : 'Umuunlad';
};

const RegionDetail = ({ region, guardian, general, language, onClose }: RegionDetailProps) => {
  const meters = REGION_METERS[region.code] || [50, 50, 50, 50];
  const avgHealth = Math.round(meters.reduce((a, b) => a + b, 0) / meters.length);

  return (
    <div className="rounded-2xl border border-[var(--luntian-primary)]/30 bg-[var(--luntian-surface)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--luntian-primary)]/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--luntian-primary-light)]">
              {language === 'fil' && region.name_filipino ? region.name_filipino : region.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-[var(--luntian-text-muted)]">
              <span>Saga {region.saga}</span>
              <span>•</span>
              <span>{language === 'en' ? 'Chapter' : 'Kabanata'} {region.chapter_number}</span>
              <span>•</span>
              <span className="uppercase text-xs tracking-wider">{region.code}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--luntian-text-muted)] hover:text-[var(--luntian-text)] transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-4">
        <p className="text-sm text-[var(--luntian-text-muted)] leading-relaxed">
          {language === 'fil' && region.description_filipino
            ? region.description_filipino
            : region.description}
        </p>
      </div>

      {/* Guardian + General Cards */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        {guardian && (
          <div
            className="rounded-xl p-3 border"
            style={{
              backgroundColor: `${ELEMENT_CONFIG[guardian.element].bgColor}22`,
              borderColor: `${ELEMENT_CONFIG[guardian.element].color}44`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{ELEMENT_CONFIG[guardian.element].emoji}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: ELEMENT_CONFIG[guardian.element].color }}>
                  {guardian.display_name}
                </div>
                <div className="text-[10px] text-[var(--luntian-text-muted)]">
                  {language === 'en' ? 'Guardian' : 'Tagapag-alaga'}
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {[guardian.power_1, guardian.power_2, guardian.power_3].map((p, i) => (
                <span
                  key={i}
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    color: ELEMENT_CONFIG[guardian.element].color,
                    backgroundColor: `${ELEMENT_CONFIG[guardian.element].color}15`,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {general && (
          <div className="rounded-xl p-3 border border-red-900/40 bg-red-950/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💀</span>
              <div>
                <div className="text-sm font-bold text-red-400">{general.display_name}</div>
                <div className="text-[10px] text-red-300/60">
                  {general.threat_display}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--luntian-text-muted)] mt-2">
              {general.battle_phases} {language === 'en' ? 'battle phases' : 'yugto ng laban'}
            </div>
          </div>
        )}
      </div>

      {/* Kalikasan Engine — Environment Meters */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--luntian-text-muted)]">
            🌍 {language === 'en' ? 'Kalikasan Engine' : 'Makina ng Kalikasan'}
          </h3>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-bold"
              style={{ color: getMeterColor(avgHealth) }}
            >
              {avgHealth}%
            </span>
            <span className="text-[10px] text-[var(--luntian-text-muted)]">
              {getMeterLabel(avgHealth, language)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {KALIKASAN_METERS.map((meter, i) => {
            const val = meters[i];
            const color = getMeterColor(val);
            return (
              <div key={meter.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--luntian-text-muted)]">
                    {meter.emoji} {language === 'fil' ? meter.labelFil : meter.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color }}>
                      {val}%
                    </span>
                    <span className="text-[9px]" style={{ color }}>
                      {getMeterLabel(val, language)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 6px ${color}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Meter Legend */}
        <div className="flex justify-center gap-4 mt-4 text-[9px] text-[var(--luntian-text-muted)]/60">
          <span>💀 0-25% Dead</span>
          <span>🟤 26-50% Dying</span>
          <span>🟢 51-75% Healing</span>
          <span>🌟 76-100% Thriving</span>
        </div>
      </div>
    </div>
  );
};

export default RegionDetail;