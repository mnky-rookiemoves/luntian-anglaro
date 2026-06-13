import { useState, useEffect } from 'react';
import { gameService } from '@/services';
import { useGameStore } from '@/store';
import type { LeaderboardEntry } from '@/types/game.types';

const LeaderboardPage = () => {
  const { language } = useGameStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await gameService.getLeaderboard('OVERALL');
        setEntries(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-gold)] mb-2">
        📊 {language === 'en' ? 'Leaderboard' : 'Talaan ng mga Nangunguna'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en'
          ? 'The top Guardians fighting for the environment.'
          : 'Ang mga nangungunang Tagapag-alaga na lumalaban para sa kalikasan.'}
      </p>

      {loading ? (
        <div className="text-[var(--luntian-text-muted)] animate-pulse">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-[var(--luntian-text-muted)] text-lg">
            {language === 'en' ? 'No entries yet. Be the first Guardian!' : 'Wala pang entry. Maging unang Guardian!'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-[var(--luntian-primary)]/20">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--luntian-surface)] text-[var(--luntian-text-muted)] text-xs uppercase">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Player</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Chapters</th>
                <th className="p-3 text-center">🌳 Trees</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-white/5 hover:bg-[var(--luntian-primary)]/5">
                  <td className="p-3 font-bold text-[var(--luntian-gold)]">#{e.rank}</td>
                  <td className="p-3">
                    <span className="font-semibold text-[var(--luntian-text)]">{e.player_name}</span>
                    <span className="ml-2 text-xs text-[var(--luntian-text-muted)]">{e.player_form}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-[var(--luntian-primary-light)]">{e.total_score.toLocaleString()}</td>
                  <td className="p-3 text-center text-[var(--luntian-text-muted)]">{e.chapters_completed}</td>
                  <td className="p-3 text-center text-[var(--luntian-primary-light)]">{e.trees_planted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;