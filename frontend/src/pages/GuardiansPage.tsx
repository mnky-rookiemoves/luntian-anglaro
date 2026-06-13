import { useEffect } from 'react';
import { useGameStore } from '@/store';
import { ELEMENT_CONFIG } from '@/types/game.types';

const GuardiansPage = () => {
  const { guardians, initialize, isInitialized, language } = useGameStore();

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-primary-light)] mb-2">
        🛡️ {language === 'en' ? 'The Guardians' : 'Ang Mga Tagapag-alaga'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'Five elemental spirits sworn to protect the Philippine environment.'
          : 'Limang espiritu ng elemento na nanumpa upang protektahan ang kalikasan ng Pilipinas.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guardians.map((g) => {
          const config = ELEMENT_CONFIG[g.element];
          return (
            <div
              key={g.id}
              className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
              style={{
                backgroundColor: `${config.bgColor}33`,
                borderColor: `${config.color}55`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{config.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: config.color }}>
                    {g.display_name}
                  </h2>
                  <span className="text-xs text-[var(--luntian-text-muted)]">
                    {g.element_display} • {g.combat_role_display}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--luntian-text-muted)] mb-4">
                {language === 'fil' && g.description_filipino
                  ? g.description_filipino
                  : g.description}
              </p>

              {/* Powers */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xs font-semibold text-[var(--luntian-text-muted)] uppercase tracking-wider">
                  {language === 'en' ? 'Powers' : 'Kapangyarihan'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[g.power_1, g.power_2, g.power_3].map((power, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${config.color}22`,
                        color: config.color,
                        border: `1px solid ${config.color}44`,
                      }}
                    >
                      {power}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-[var(--luntian-text-muted)]/60 pt-3 border-t border-white/5">
                <span>📍 {g.region_name || 'Unknown'}</span>
                <span>Ch.{g.awakening_chapter}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuardiansPage;