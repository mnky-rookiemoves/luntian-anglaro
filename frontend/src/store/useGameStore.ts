/**
 * 🌿 LUNTIAN ANGLARO — Game Store (Zustand)
 * Global state for game data + loading states.
 */

import { create } from 'zustand';
import { gameService, playerService } from '@/services';
import type {
  Region,
  Guardian,
  General,
  Achievement,
  PlayerProfile,
  ApiHealth,
  GameMessage,
} from '@/types/game.types';

interface GameStore {
  // ── State ────────────────────────────────────────────
  health: ApiHealth | null;
  regions: Region[];
  guardians: Guardian[];
  generals: General[];
  achievements: Achievement[];
  messages: GameMessage[];
  currentPlayer: PlayerProfile | null;

  // ── Loading & Errors ─────────────────────────────────
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // ── Language ─────────────────────────────────────────
  language: 'en' | 'fil';
  toggleLanguage: () => void;

  // ── Actions ──────────────────────────────────────────
  initialize: () => Promise<void>;
  checkHealth: () => Promise<void>;
  loadGameData: () => Promise<void>;
  loadPlayer: (id: number) => Promise<void>;
  createPlayer: (displayName: string) => Promise<PlayerProfile>;
  clearError: () => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  // ── Initial State ────────────────────────────────────
  health: null,
  regions: [],
  guardians: [],
  generals: [],
  achievements: [],
  messages: [],
  currentPlayer: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  language: 'en',

  // ── Language Toggle ──────────────────────────────────
  toggleLanguage: () => {
    const current = get().language;
    set({ language: current === 'en' ? 'fil' : 'en' });
  },

  // ── Initialize (Load Everything) ────────────────────
  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      await get().checkHealth();
      await get().loadGameData();
      set({ isInitialized: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize';
      set({ error: message });
      console.error('🌿 Initialization failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Health Check ─────────────────────────────────────
  checkHealth: async () => {
    try {
      const health = await gameService.health();
      set({ health });
    } catch {
      throw new Error('Cannot connect to LUNTIAN server');
    }
  },

  // ── Load All Game Data ───────────────────────────────
  loadGameData: async () => {
    try {
      const [regions, guardians, generals, achievements, messages] =
        await Promise.all([
          gameService.getRegions(),
          gameService.getGuardians(),
          gameService.getGenerals(),
          gameService.getAchievements(),
          gameService.getMessages(),
        ]);

      set({ regions, guardians, generals, achievements, messages });
    } catch {
      throw new Error('Failed to load game data');
    }
  },

  // ── Player Management ────────────────────────────────
  loadPlayer: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const player = await playerService.getPlayer(id);
      set({ currentPlayer: player });
    } catch {
      set({ error: 'Failed to load player profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlayer: async (displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const player = await playerService.createPlayer({
        display_name: displayName,
      });
      set({ currentPlayer: player });
      return player;
    } catch {
      set({ error: 'Failed to create player' });
      throw new Error('Failed to create player');
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Utility ──────────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useGameStore;