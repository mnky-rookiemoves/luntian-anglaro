import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store';
import { ELEMENT_CONFIG, RARITY_CONFIG } from '@/types/game.types';
import type { LuntianForm, EcoRank } from '@/types/game.types';

const FORM_CONFIG: Record<LuntianForm, { emoji: string; label: string; labelFil: string }> = {
  SEEDLING: { emoji: '🌱', label: 'Binhi (Seedling)', labelFil: 'Binhi' },
  SPROUT: { emoji: '🌿', label: 'Supling (Sprout)', labelFil: 'Supling' },
  SAPLING: { emoji: '🌳', label: 'Punla (Sapling)', labelFil: 'Punla' },
  TREE: { emoji: '🌲', label: 'Puno (Tree)', labelFil: 'Puno' },
  ANCIENT: { emoji: '🌴', label: 'Punong Kahoy (Ancient)', labelFil: 'Punong Kahoy' },
};

const RANK_CONFIG: Record<EcoRank, { emoji: string; color: string }> = {
  VOLUNTEER: { emoji: '🤝', color: '#9E9E9E' },
  ADVOCATE: { emoji: '📢', color: '#4CAF50' },
  GUARDIAN: { emoji: '🛡️', color: '#2196F3' },
  CHAMPION: { emoji: '⚔️', color: '#9C27B0' },
  BANTAY: { emoji: '👑', color: '#FFD600' },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentPlayer, language, guardians } = useGameStore();

  useEffect(() => {
    if (!currentPlayer) {
      navigate('/create-player');
    }
  }, [currentPlayer, navigate]);

  if (!currentPlayer) return null;

  const form = FORM_CONFIG[currentPlayer.luntian_form];
  const rank = RANK_CONFIG[currentPlayer.eco_rank];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Player Header Card */}
      <div className="rounded-2xl p-6 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20 mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-[var(--luntian-primary)]/10 border-2 border-[var(--luntian-primary)]/40 flex items-center justify-center text-4xl">
            {form.emoji}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--luntian-text)]">
              {currentPlayer.display_name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-[var(--luntian-primary-light)]">
                {language === 'fil' ? form.labelFil : form.label}
              </span>
              <span className="text-[var(--luntian-text-muted)]">•</span>
              <span className="text-sm" style={{ color: rank.color }}>
                {rank.emoji} {currentPlayer.eco_rank_display}
              </span>
            </div>
            <div className="text-xs text-[var(--luntian-text-muted)] mt-1">
              {language === 'en' ? 'Joined' : 'Sumali'}: {new Date(currentPlayer.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Level Badge */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--luntian-gold)] flex items-center justify-center bg-[var(--luntian-gold)]/10">
              <span className="text-2xl font-bold text-[var(--luntian-gold)]">
                {currentPlayer.level}
              </span>
            </div>
            <div className="text-[10px] text-[var(--luntian-text-muted)] mt-1">
              {language === 'en' ? 'LEVEL' : 'ANTAS'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: language === 'en' ? 'Total XP' : 'Kabuuang XP', value: currentPlayer.total_xp.toLocaleString(), icon: '⭐', color: 'var(--luntian-gold)' },
          { label: language === 'en' ? 'Score' : 'Iskor', value: currentPlayer.total_score.toLocaleString(), icon: '🏆', color: 'var(--luntian-primary-light)' },
          { label: language === 'en' ? 'Trees Planted' : 'Punong Naitanim', value: currentPlayer.trees_planted.toLocaleString(), icon: '🌳', color: '#4CAF50' },
          { label: language === 'en' ? 'Play Time' : 'Oras ng Laro', value: formatTime(currentPlayer.total_play_time_seconds), icon: '⏱️', color: 'var(--luntian-sky)' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/15 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-[var(--luntian-text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Battle Stats + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Battle Stats */}
        <div className="rounded-2xl p-5 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
          <h2 className="text-lg font-semibold text-[var(--luntian-text)] mb-4">
            ⚔️ {language === 'en' ? 'Battle Stats' : 'Stats ng Laban'}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Battles Won' : 'Mga Panalo'}
              </span>
              <span className="font-bold text-green-400">{currentPlayer.battles_won}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Battles Lost' : 'Mga Talo'}
              </span>
              <span className="font-bold text-red-400">{currentPlayer.battles_lost}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Win Rate' : 'Porsyento ng Panalo'}
              </span>
              <span className="font-bold text-[var(--luntian-gold)]">{currentPlayer.win_rate}%</span>
            </div>
            {/* Win rate bar */}
            <div className="w-full bg-red-900/30 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentPlayer.win_rate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="rounded-2xl p-5 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
          <h2 className="text-lg font-semibold text-[var(--luntian-text)] mb-4">
            🗺️ {language === 'en' ? 'Journey Progress' : 'Progreso ng Paglalakbay'}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Current Chapter' : 'Kasalukuyang Kabanata'}
              </span>
              <span className="font-bold text-[var(--luntian-text)]">Ch.{currentPlayer.current_chapter}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Current Saga' : 'Kasalukuyang Saga'}
              </span>
              <span className="font-bold text-[var(--luntian-text)]">
                Saga {currentPlayer.current_saga} — {currentPlayer.current_saga === 1 ? 'Ang Paggising' : 'Ang Pagkabulok'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Guardians Awakened' : 'Mga Gising na Tagapag-alaga'}
              </span>
              <span className="font-bold text-[var(--luntian-primary-light)]">{currentPlayer.guardians_awakened}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--luntian-text-muted)]">
                {language === 'en' ? 'Generals Defeated' : 'Mga Heneral na Natalo'}
              </span>
              <span className="font-bold text-red-400">{currentPlayer.generals_defeated}/6</span>
            </div>
            {/* Guardians progress bar */}
            <div className="w-full bg-[var(--luntian-primary)]/10 rounded-full h-2 mt-2">
              <div
                className="bg-[var(--luntian-primary)] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentPlayer.guardians_awakened / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Guardians */}
      <div className="rounded-2xl p-5 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
        <h2 className="text-lg font-semibold text-[var(--luntian-text)] mb-4">
          🛡️ {language === 'en' ? 'Active Guardians' : 'Mga Aktibong Tagapag-alaga'}
        </h2>
        {currentPlayer.active_guardians.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔮</div>
            <p className="text-[var(--luntian-text-muted)]">
              {language === 'en'
                ? 'No guardians awakened yet. Begin your journey to awaken them!'
                : 'Wala pang gising na tagapag-alaga. Simulan ang iyong paglalakbay para gisingin sila!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {currentPlayer.active_guardians.map((g) => {
              const config = ELEMENT_CONFIG[g.element];
              return (
                <div
                  key={g.id}
                  className="rounded-xl p-3 text-center border"
                  style={{
                    backgroundColor: `${config.bgColor}22`,
                    borderColor: `${config.color}44`,
                  }}
                >
                  <div className="text-2xl">{config.emoji}</div>
                  <div className="text-sm font-bold" style={{ color: config.color }}>
                    {g.display_name}
                  </div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">
                    {g.combat_role_display}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show locked guardians */}
        {currentPlayer.active_guardians.length < 5 && (
          <div className="flex gap-2 mt-4 justify-center">
            {guardians
              .filter((g) => !currentPlayer.active_guardians.find((ag) => ag.id === g.id))
              .map((g) => (
                <div
                  key={g.id}
                  className="rounded-lg p-2 text-center opacity-30 border border-white/10"
                >
                  <div className="text-lg">🔒</div>
                  <div className="text-[10px] text-[var(--luntian-text-muted)]">{g.display_name}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;