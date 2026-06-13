/**
 * 🌿 LUNTIAN ANGLARO — Player Service
 * CRUD endpoints for player-specific data.
 */

import api from './api';
import type {
  PlayerProfile,
  PlayerProfileCreate,
  BattleRecord,
  ChapterProgress,
  EnvironmentalMeter,
} from '@/types/game.types';

const playerService = {
  // ── Player Profiles ──────────────────────────────────
  getPlayers: async (): Promise<PlayerProfile[]> => {
    const { data } = await api.get<PlayerProfile[]>('/players/');
    return data;
  },

  getPlayer: async (id: number): Promise<PlayerProfile> => {
    const { data } = await api.get<PlayerProfile>(`/players/${id}/`);
    return data;
  },

  createPlayer: async (player: PlayerProfileCreate): Promise<PlayerProfile> => {
    const { data } = await api.post<PlayerProfile>('/players/', player);
    return data;
  },

  updatePlayer: async (id: number, updates: Partial<PlayerProfile>): Promise<PlayerProfile> => {
    const { data } = await api.patch<PlayerProfile>(`/players/${id}/`, updates);
    return data;
  },

  // ── Battle Records ───────────────────────────────────
  getBattles: async (playerId?: number): Promise<BattleRecord[]> => {
    const params = playerId ? { player: playerId } : {};
    const { data } = await api.get<BattleRecord[]>('/battles/', { params });
    return data;
  },

  createBattle: async (battle: Omit<BattleRecord, 'id' | 'created_at' | 'battle_type_display' | 'guardian_name'>): Promise<BattleRecord> => {
    const { data } = await api.post<BattleRecord>('/battles/', battle);
    return data;
  },

  // ── Chapter Progress ─────────────────────────────────
  getChapterProgress: async (playerId?: number): Promise<ChapterProgress[]> => {
    const params = playerId ? { player: playerId } : {};
    const { data } = await api.get<ChapterProgress[]>('/chapters/', { params });
    return data;
  },

  updateChapterProgress: async (id: number, updates: Partial<ChapterProgress>): Promise<ChapterProgress> => {
    const { data } = await api.patch<ChapterProgress>(`/chapters/${id}/`, updates);
    return data;
  },

  // ── Environmental Meters (Kalikasan Engine) ──────────
  getEnvMeters: async (playerId?: number): Promise<EnvironmentalMeter[]> => {
    const params = playerId ? { player: playerId } : {};
    const { data } = await api.get<EnvironmentalMeter[]>('/env-meters/', { params });
    return data;
  },

  updateEnvMeter: async (id: number, value: number): Promise<EnvironmentalMeter> => {
    const { data } = await api.patch<EnvironmentalMeter>(`/env-meters/${id}/`, { value });
    return data;
  },
};

export default playerService;