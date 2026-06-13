/**
 * 🌿 LUNTIAN ANGLARO — Game Service
 * Read-only endpoints for game data.
 */

import api from './api';
import type {
  ApiHealth,
  Region,
  Guardian,
  General,
  Achievement,
  EnvironmentalData,
  GameMessage,
  LeaderboardEntry,
} from '@/types/game.types';

const gameService = {
  // ── Health Check ─────────────────────────────────────
  health: async (): Promise<ApiHealth> => {
    const { data } = await api.get<ApiHealth>('/health/');
    return data;
  },

  // ── Regions ──────────────────────────────────────────
  getRegions: async (): Promise<Region[]> => {
    const { data } = await api.get<Region[]>('/regions/');
    return data;
  },

  getRegion: async (id: number): Promise<Region> => {
    const { data } = await api.get<Region>(`/regions/${id}/`);
    return data;
  },

  // ── Guardians ────────────────────────────────────────
  getGuardians: async (): Promise<Guardian[]> => {
    const { data } = await api.get<Guardian[]>('/guardians/');
    return data;
  },

  getGuardian: async (id: number): Promise<Guardian> => {
    const { data } = await api.get<Guardian>(`/guardians/${id}/`);
    return data;
  },

  // ── Generals ─────────────────────────────────────────
  getGenerals: async (): Promise<General[]> => {
    const { data } = await api.get<General[]>('/generals/');
    return data;
  },

  getGeneral: async (id: number): Promise<General> => {
    const { data } = await api.get<General>(`/generals/${id}/`);
    return data;
  },

  // ── Achievements ─────────────────────────────────────
  getAchievements: async (showHidden = false): Promise<Achievement[]> => {
    const { data } = await api.get<Achievement[]>('/achievements/', {
      params: { show_hidden: showHidden },
    });
    return data;
  },

  // ── Environmental Data (Codex) ───────────────────────
  getEcoData: async (params?: {
    category?: string;
    chapter?: number;
  }): Promise<EnvironmentalData[]> => {
    const { data } = await api.get<EnvironmentalData[]>('/eco-data/', { params });
    return data;
  },

  // ── Game Messages ────────────────────────────────────
  getMessages: async (params?: {
    type?: string;
    chapter?: number;
  }): Promise<GameMessage[]> => {
    const { data } = await api.get<GameMessage[]>('/messages/', { params });
    return data;
  },

  // ── Leaderboard ──────────────────────────────────────
  getLeaderboard: async (type = 'OVERALL'): Promise<LeaderboardEntry[]> => {
    const { data } = await api.get<LeaderboardEntry[]>('/leaderboard/', {
      params: { type },
    });
    return data;
  },
};

export default gameService;