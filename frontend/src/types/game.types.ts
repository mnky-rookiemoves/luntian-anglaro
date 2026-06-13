/**
 * 🌿 LUNTIAN ANGLARO — TypeScript Type Definitions
 * Mirrors all 13 Django models exactly.
 * "Luntiang Puso, Luntiang Gawa"
 */

// ============================================================
// 🗺️ REGION
// ============================================================

export type RegionCode = 'NCR' | 'MNL_BAY' | 'CAR' | 'MIN_FOR' | 'TUB' | 'HUB';

export interface Region {
  id: number;
  code: RegionCode;
  name: string;
  name_filipino: string;
  description: string;
  description_filipino: string;
  chapter_number: number;
  saga: 1 | 2;
  is_unlocked_by_default: boolean;
  sort_order: number;
  // Serializer extras
  guardian_name: string | null;
  general_name: string | null;
}

// ============================================================
// 🛡️ GUARDIAN
// ============================================================

export type GuardianElement = 'NATURE' | 'WATER' | 'EARTH' | 'WIND' | 'MARINE';
export type CombatRole = 'BALANCED' | 'AOE_HEALER' | 'TANK' | 'SPEED' | 'SUPPORT';

export interface Guardian {
  id: number;
  name: string;
  display_name: string;
  display_name_filipino: string;
  element: GuardianElement;
  combat_role: CombatRole;
  region: number | null;
  awakening_chapter: number;
  power_1: string;
  power_2: string;
  power_3: string;
  description: string;
  description_filipino: string;
  lore: string;
  sprite_key: string;
  sort_order: number;
  // Serializer extras
  region_name: string | null;
  element_display: string;
  combat_role_display: string;
}

// ============================================================
// 💀 GENERAL
// ============================================================

export type ThreatType = 'AIR' | 'WATER' | 'MINING' | 'FOREST' | 'OCEAN' | 'CORRUPT' | 'FINAL';

export interface General {
  id: number;
  name: string;
  display_name: string;
  display_name_filipino: string;
  threat_type: ThreatType;
  region: number | null;
  chapter_number: number;
  saga: 1 | 2;
  battle_phases: number;
  description: string;
  description_filipino: string;
  weakness_element: GuardianElement | '';
  sprite_key: string;
  sort_order: number;
  // Serializer extras
  region_name: string | null;
  threat_display: string;
}

// ============================================================
// 👤 PLAYER PROFILE
// ============================================================

export type LuntianForm = 'SEEDLING' | 'SPROUT' | 'SAPLING' | 'TREE' | 'ANCIENT';
export type EcoRank = 'VOLUNTEER' | 'ADVOCATE' | 'GUARDIAN' | 'CHAMPION' | 'BANTAY';

export interface PlayerProfile {
  id: number;
  display_name: string;
  level: number;
  total_xp: number;
  total_score: number;
  current_chapter: number;
  current_saga: 1 | 2;
  luntian_form: LuntianForm;
  eco_rank: EcoRank;
  guardians_awakened: number;
  generals_defeated: number;
  active_guardians: Guardian[];
  trees_planted: number;
  total_play_time_seconds: number;
  battles_won: number;
  battles_lost: number;
  created_at: string;
  updated_at: string;
  last_played: string | null;
  // Serializer extras
  luntian_form_display: string;
  eco_rank_display: string;
  win_rate: number;
}

export interface PlayerProfileCreate {
  display_name: string;
}

// ============================================================
// 💾 GAME STATE
// ============================================================

export interface GameState {
  id: number;
  player: number;
  slot_number: 1 | 2 | 3;
  current_region: number | null;
  current_chapter: number;
  current_saga: 1 | 2;
  inventory_data: Record<string, unknown>;
  quest_data: Record<string, unknown>;
  environment_data: Record<string, unknown>;
  saved_at: string;
  play_time_seconds: number;
  // Serializer extras
  region_name: string | null;
}

// ============================================================
// 📖 CHAPTER PROGRESS
// ============================================================

export type ChapterStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ChapterProgress {
  id: number;
  player: number;
  chapter_number: number;
  chapter_title: string;
  chapter_title_filipino: string;
  saga: 1 | 2;
  status: ChapterStatus;
  score: number;
  guardian_awakened: number | null;
  general_defeated: number | null;
  completion_percentage: number;
  time_spent_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  // Serializer extras
  status_display: string;
  guardian_name: string | null;
  general_name: string | null;
}

// ============================================================
// ⚔️ BATTLE RECORD
// ============================================================

export type BattleType = 'BOSS' | 'MINION' | 'ARENA' | 'HORDE';

export interface BattleRecord {
  id: number;
  player: number;
  battle_type: BattleType;
  general: number | null;
  enemy_name: string;
  chapter_number: number;
  region: number | null;
  won: boolean;
  score: number;
  xp_earned: number;
  guardian_used: number | null;
  battle_duration_seconds: number;
  damage_dealt: number;
  damage_taken: number;
  combos_landed: number;
  created_at: string;
  // Serializer extras
  battle_type_display: string;
  guardian_name: string | null;
}

// ============================================================
// 🌍 ENVIRONMENTAL METER (Kalikasan Engine)
// ============================================================

export type MeterType = 'FOREST' | 'WATER' | 'AIR' | 'WILDLIFE' | 'GOVERNANCE';
export type VisualState = 'DEAD' | 'DYING' | 'HEALING' | 'THRIVING';

export interface EnvironmentalMeter {
  id: number;
  player: number;
  region: number;
  meter_type: MeterType;
  value: number;
  updated_at: string;
  // Serializer extras
  meter_display: string;
  visual_state: VisualState;
  region_name: string;
}

// ============================================================
// 🏆 ACHIEVEMENT
// ============================================================

export type AchievementType = 'STORY' | 'COMBAT' | 'EXPLORATION' | 'ENVIRONMENTAL' | 'COMMUNITY' | 'SECRET';
export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Achievement {
  id: number;
  name: string;
  name_filipino: string;
  code: string;
  achievement_type: AchievementType;
  rarity: Rarity;
  description: string;
  description_filipino: string;
  points: number;
  icon_key: string;
  is_hidden: boolean;
  // Serializer extras
  type_display: string;
  rarity_display: string;
}

// ============================================================
// 🎖️ PLAYER ACHIEVEMENT
// ============================================================

export interface PlayerAchievement {
  id: number;
  player: number;
  achievement: number;
  unlocked_at: string;
  // Serializer extras
  achievement_detail: Achievement;
}

// ============================================================
// 📊 LEADERBOARD ENTRY
// ============================================================

export type LeaderboardType = 'OVERALL' | 'COMBAT' | 'ENV' | 'COMMUNITY' | 'WEEKLY';

export interface LeaderboardEntry {
  id: number;
  player: number;
  leaderboard_type: LeaderboardType;
  rank: number;
  total_score: number;
  chapters_completed: number;
  trees_planted: number;
  last_updated: string;
  // Serializer extras
  player_name: string;
  player_form: string;
}

// ============================================================
// 📚 ENVIRONMENTAL DATA
// ============================================================

export type EcoCategory = 'LAW' | 'SPECIES' | 'CLIMATE' | 'POLLUTION' | 'CONSERVATION' | 'HISTORY';
export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EnvironmentalData {
  id: number;
  title: string;
  title_filipino: string;
  category: EcoCategory;
  impact_level: ImpactLevel;
  content: string;
  content_filipino: string;
  source: string;
  related_chapter: number | null;
  related_region: number | null;
  is_codex_entry: boolean;
  created_at: string;
  // Serializer extras
  category_display: string;
  impact_display: string;
}

// ============================================================
// 💬 GAME MESSAGE
// ============================================================

export type MessageType = 'DIALOGUE' | 'TUTORIAL' | 'NOTIFICATION' | 'GREETING' | 'LORE' | 'UI' | 'ACHIEVEMENT' | 'BATTLE';

export interface GameMessage {
  id: number;
  key: string;
  message_type: MessageType;
  chapter: number | null;
  speaker: string;
  text_english: string;
  text_filipino: string;
  context: string;
  sort_order: number;
  // Serializer extras
  type_display: string;
}

// ============================================================
// 🔧 API RESPONSE TYPES
// ============================================================

export interface ApiHealth {
  status: string;
  game: string;
  tagline: string;
  version: string;
}

/** Element metadata for UI rendering */
export const ELEMENT_CONFIG: Record<GuardianElement, {
  emoji: string;
  color: string;
  bgColor: string;
}> = {
  NATURE: { emoji: '🌱', color: '#4CAF50', bgColor: '#1B5E20' },
  WATER:  { emoji: '🌊', color: '#2196F3', bgColor: '#0D47A1' },
  EARTH:  { emoji: '🌋', color: '#FF5722', bgColor: '#BF360C' },
  WIND:   { emoji: '🦅', color: '#9C27B0', bgColor: '#4A148C' },
  MARINE: { emoji: '🐢', color: '#00BCD4', bgColor: '#006064' },
};

/** Rarity metadata for UI rendering */
export const RARITY_CONFIG: Record<Rarity, {
  emoji: string;
  color: string;
  label: string;
}> = {
  COMMON:    { emoji: '⬜', color: '#9E9E9E', label: 'Common' },
  UNCOMMON:  { emoji: '🟩', color: '#4CAF50', label: 'Uncommon' },
  RARE:      { emoji: '🟦', color: '#2196F3', label: 'Rare' },
  EPIC:      { emoji: '🟪', color: '#9C27B0', label: 'Epic' },
  LEGENDARY: { emoji: '🟨', color: '#FFD600', label: 'Legendary' },
};

/** Meter visual state metadata */
export const METER_STATE_CONFIG: Record<VisualState, {
  emoji: string;
  color: string;
  label: string;
  range: string;
}> = {
  DEAD:     { emoji: '💀', color: '#616161', label: 'Dead',     range: '0-25%' },
  DYING:    { emoji: '🟤', color: '#795548', label: 'Dying',    range: '26-50%' },
  HEALING:  { emoji: '🟢', color: '#4CAF50', label: 'Healing',  range: '51-75%' },
  THRIVING: { emoji: '🌟', color: '#FFD600', label: 'Thriving', range: '76-100%' },
};