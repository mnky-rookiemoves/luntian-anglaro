import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import GuardiansPage from '@/pages/GuardiansPage';
import GeneralsPage from '@/pages/GeneralsPage';
import RegionsPage from '@/pages/RegionsPage';
import AchievementsPage from '@/pages/AchievementsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import CodexPage from '@/pages/CodexPage';
import CreatePlayerPage from '@/pages/CreatePlayerPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/guardians" element={<GuardiansPage />} />
          <Route path="/generals" element={<GeneralsPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/codex" element={<CodexPage />} />
          <Route path="/create-player" element={<CreatePlayerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--luntian-surface)',
            color: 'var(--luntian-text)',
            border: '1px solid var(--luntian-primary)',
          },
        }}
      />
    </Router>
  );
}

export default App;