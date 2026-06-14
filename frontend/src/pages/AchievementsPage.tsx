import { useEffect } from 'react';
import { useGameStore } from '@/store';
import { RARITY_CONFIG } from '@/types/game.types';

const AchievementsPage = () => {
  const { achievements, initialize, isInitialized, language } = useGameStore();

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-gold)] mb-2">
        🏆 {language === 'en' ? 'Achievements' : 'Mga Tagumpay'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'Milestones on your journey to becoming Bantay ng Kalikasan.'
          : 'Mga hakbang sa iyong paglalakbay upang maging Bantay ng Kalikasan.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(achievements || []).map((a) => {
          const rarity = RARITY_CONFIG[a.rarity];
          return (
            <div
              key={a.id}
              className="rounded-xl p-4 border bg-[var(--luntian-surface)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              style={{ borderColor: `${rarity.color}44` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{rarity.emoji}</span>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: rarity.color }}>
                    {language === 'fil' && a.name_filipino ? a.name_filipino : a.name}
                  </h3>
                  <span className="text-[10px]" style={{ color: `${rarity.color}99` }}>
                    {rarity.label} • {a.type_display}
                  </span>
                </div>
                <span className="ml-auto text-sm font-bold" style={{ color: rarity.color }}>
                  {a.points}pts
                </span>
              </div>
              <p className="text-xs text-[var(--luntian-text-muted)]">
                {language === 'fil' && a.description_filipino
                  ? a.description_filipino
                  : a.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;