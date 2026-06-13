import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store';
import { toast } from 'sonner';

const ALIASES = [
  'LuntianSeed', 'ForestWalker', 'TideSurfer', 'MountainHeart', 'WindRider',
  'CoralDiver', 'LeafBlade', 'StormCaller', 'RootKeeper', 'SkyWatcher',
  'EagleEye', 'TurtleShell', 'VineWhisper', 'WaveBreaker', 'RockSolid',
  'FeatherDrift', 'SunBloom', 'MoonTide', 'StarSeed', 'DawnGuard',
];

const CreatePlayerPage = () => {
  const navigate = useNavigate();
  const { createPlayer, isLoading, language } = useGameStore();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const generateAlias = () => {
    const alias = ALIASES[Math.floor(Math.random() * ALIASES.length)];
    const suffix = Math.floor(Math.random() * 999) + 1;
    setDisplayName(`${alias}${suffix}`);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = displayName.trim();
    if (!trimmed) {
      setError(language === 'en' ? 'Please enter a display name' : 'Maglagay ng display name');
      return;
    }
    if (trimmed.length < 3) {
      setError(language === 'en' ? 'Name must be at least 3 characters' : 'Dapat may 3 character ang pangalan');
      return;
    }
    if (trimmed.length > 50) {
      setError(language === 'en' ? 'Name must be 50 characters or less' : 'Dapat 50 character o mas kaunti ang pangalan');
      return;
    }

    try {
      await createPlayer(trimmed);
      toast.success(
        language === 'en'
          ? `Welcome, ${trimmed}! Your journey begins.`
          : `Maligayang pagdating, ${trimmed}! Nagsisimula na ang iyong paglalakbay.`,
        { icon: '🌿' }
      );
      navigate('/profile');
    } catch {
      setError(language === 'en' ? 'Failed to create player. Try again.' : 'Hindi nagawa ang player. Subukan muli.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl font-bold text-[var(--luntian-primary-light)] mb-2">
            {language === 'en' ? 'Begin Your Journey' : 'Simulan ang Iyong Paglalakbay'}
          </h1>
          <p className="text-[var(--luntian-text-muted)]">
            {language === 'en'
              ? 'Choose a name, Guardian. The environment needs you.'
              : 'Pumili ng pangalan, Tagapag-alaga. Kailangan ka ng kalikasan.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--luntian-text-muted)] mb-2">
              {language === 'en' ? 'Display Name' : 'Display Name'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
                placeholder={language === 'en' ? 'Enter your alias...' : 'Ilagay ang iyong alias...'}
                maxLength={50}
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/30 text-[var(--luntian-text)] placeholder-[var(--luntian-text-muted)]/40 focus:outline-none focus:border-[var(--luntian-primary)] transition-all"
              />
              <button
                type="button"
                onClick={generateAlias}
                className="px-4 py-3 rounded-lg bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/30 text-[var(--luntian-primary-light)] hover:bg-[var(--luntian-primary)]/10 transition-all text-sm"
                title={language === 'en' ? 'Generate random alias' : 'Gumawa ng random alias'}
              >
                🎲
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
            <p className="text-[10px] text-[var(--luntian-text-muted)]/50 mt-1">
              {displayName.length}/50 {language === 'en' ? 'characters' : 'character'}
            </p>
          </div>

          {/* Starting Info */}
          <div className="rounded-xl p-4 bg-[var(--luntian-primary)]/5 border border-[var(--luntian-primary)]/20 space-y-2 text-sm">
            <h3 className="font-semibold text-[var(--luntian-primary-light)]">
              {language === 'en' ? 'You will start as:' : 'Magsisimula ka bilang:'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[var(--luntian-text-muted)]">
              <div>🌱 {language === 'en' ? 'Form' : 'Anyo'}: <span className="text-[var(--luntian-text)]">Binhi (Seedling)</span></div>
              <div>⭐ {language === 'en' ? 'Level' : 'Antas'}: <span className="text-[var(--luntian-text)]">1</span></div>
              <div>🏅 {language === 'en' ? 'Rank' : 'Ranggo'}: <span className="text-[var(--luntian-text)]">Volunteer</span></div>
              <div>🗺️ {language === 'en' ? 'Region' : 'Rehiyon'}: <span className="text-[var(--luntian-text)]">Punong Bayan</span></div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !displayName.trim()}
            className="w-full py-3 rounded-lg bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_var(--luntian-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading
              ? (language === 'en' ? '🌿 Creating...' : '🌿 Ginagawa...')
              : (language === 'en' ? '🌿 Begin Journey' : '🌿 Simulan ang Paglalakbay')}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-center text-[10px] text-[var(--luntian-text-muted)]/40 mt-6">
          {language === 'en'
            ? 'Your alias keeps your identity private. No real name required.'
            : 'Pinoprotektahan ng alias ang iyong pagkakakilanlan. Hindi kailangan ng totoong pangalan.'}
        </p>
      </div>
    </div>
  );
};

export default CreatePlayerPage;