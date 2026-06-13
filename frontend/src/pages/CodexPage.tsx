import { useState, useEffect } from 'react';
import { gameService } from '@/services';
import { useGameStore } from '@/store';
import type { EnvironmentalData } from '@/types/game.types';

const CATEGORY_TABS = [
  { key: '', label: '🌍 All', labelFil: '🌍 Lahat' },
  { key: 'LAW', label: '⚖️ PH Laws', labelFil: '⚖️ Batas PH' },
  { key: 'SPECIES', label: '🐾 Species', labelFil: '🐾 Mga Hayop' },
  { key: 'CLIMATE', label: '🌡️ Climate', labelFil: '🌡️ Klima' },
  { key: 'POLLUTION', label: '🏭 Pollution', labelFil: '🏭 Polusyon' },
  { key: 'CONSERVATION', label: '🌱 Conservation', labelFil: '🌱 Konserbasyon' },
  { key: 'HISTORY', label: '📜 History', labelFil: '📜 Kasaysayan' },
];

const IMPACT_COLORS: Record<string, string> = {
  LOW: '#4CAF50',
  MEDIUM: '#FFD600',
  HIGH: '#FF5722',
  CRITICAL: '#212121',
};

const CodexPage = () => {
  const { language } = useGameStore();
  const [entries, setEntries] = useState<EnvironmentalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = activeCategory ? { category: activeCategory } : {};
        const data = await gameService.getEcoData(params);
        setEntries(data);
      } catch (err) {
        console.error('Failed to load eco data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-primary-light)] mb-2">
        📚 {language === 'en' ? 'Lore Codex — Eskwelahan' : 'Lore Codex — Eskwelahan'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-6">
        {language === 'en'
          ? 'Real-world environmental data, Philippine laws, and ecological facts.'
          : 'Tunay na datos tungkol sa kalikasan, batas ng Pilipinas, at ekolohikal na katotohanan.'}
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              activeCategory === tab.key
                ? 'bg-[var(--luntian-primary)] text-white'
                : 'bg-[var(--luntian-surface)] text-[var(--luntian-text-muted)] hover:bg-[var(--luntian-primary)]/20'
            }`}
          >
            {language === 'fil' ? tab.labelFil : tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[var(--luntian-text-muted)] animate-pulse">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-[var(--luntian-text-muted)] text-lg">
            {language === 'en'
              ? 'No codex entries yet. Explore the world to discover more!'
              : 'Wala pang entry sa codex. Tuklasin ang mundo para makatuklas pa!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <div
              key={e.id}
              className="rounded-xl p-5 border border-[var(--luntian-primary)]/20 bg-[var(--luntian-surface)] hover:bg-[var(--luntian-primary)]/5 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-[var(--luntian-text)]">
                  {language === 'fil' && e.title_filipino ? e.title_filipino : e.title}
                </h3>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{
                    color: IMPACT_COLORS[e.impact_level],
                    backgroundColor: `${IMPACT_COLORS[e.impact_level]}22`,
                    border: `1px solid ${IMPACT_COLORS[e.impact_level]}44`,
                  }}
                >
                  {e.impact_display}
                </span>
              </div>
              <p className="text-sm text-[var(--luntian-text-muted)] mb-3">
                {language === 'fil' && e.content_filipino ? e.content_filipino : e.content}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-[var(--luntian-text-muted)]/60">
                <span>{e.category_display}</span>
                {e.related_chapter && <span>• Ch.{e.related_chapter}</span>}
                {e.source && <span>• 📎 {e.source}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodexPage;