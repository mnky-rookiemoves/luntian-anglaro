import { useEffect } from 'react';
import { useGameStore } from '@/store';

const RegionsPage = () => {
  const { regions, initialize, isInitialized, language } = useGameStore();

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-sky)] mb-2">
        🗺️ {language === 'en' ? 'Regions of the Philippines' : 'Mga Rehiyon ng Pilipinas'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'Explore the regions where the battle for the environment unfolds.'
          : 'Tuklasin ang mga rehiyon kung saan nagaganap ang labanan para sa kalikasan.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Array.isArray(regions) ? regions : []).map((r) => (
          <div
            key={r.id}
            className="rounded-2xl p-6 border border-[var(--luntian-primary)]/30 bg-[var(--luntian-surface)] hover:bg-[var(--luntian-primary)]/5 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-[var(--luntian-primary-light)]">
                  {language === 'fil' && r.name_filipino ? r.name_filipino : r.name}
                </h2>
                <span className="text-xs text-[var(--luntian-text-muted)]">
                  Code: {r.code} • Saga {r.saga} • Ch.{r.chapter_number}
                </span>
              </div>
              {r.is_unlocked_by_default && (
                <span className="px-2 py-1 rounded-full text-[10px] bg-green-900/30 text-green-400 border border-green-700">
                  🔓 {language === 'en' ? 'Unlocked' : 'Bukas'}
                </span>
              )}
            </div>

            <p className="text-sm text-[var(--luntian-text-muted)] mb-4">
              {language === 'fil' && r.description_filipino
                ? r.description_filipino
                : r.description}
            </p>

            <div className="flex gap-4 text-xs">
              {r.guardian_name && (
                <span className="px-2 py-1 rounded-lg bg-[var(--luntian-primary)]/10 text-[var(--luntian-primary-light)] border border-[var(--luntian-primary)]/30">
                  🛡️ {r.guardian_name}
                </span>
              )}
              {r.general_name && (
                <span className="px-2 py-1 rounded-lg bg-red-900/20 text-red-400 border border-red-800/30">
                  💀 {r.general_name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionsPage;