"""
🌿 LUNTIAN ANGLARO — Admin Configuration
13 Models, fully configured for Django Admin
"""

from django.contrib import admin
from .models import (
    Region, Guardian, General, PlayerProfile, GameState,
    ChapterProgress, BattleRecord, EnvironmentalMeter,
    Achievement, PlayerAchievement, LeaderboardEntry,
    EnvironmentalData, GameMessage
)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'chapter_number', 'saga', 'is_unlocked_by_default']
    list_filter = ['saga', 'is_unlocked_by_default']
    search_fields = ['name', 'name_filipino', 'code']
    ordering = ['sort_order']


@admin.register(Guardian)
class GuardianAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'element', 'combat_role', 'region', 'awakening_chapter']
    list_filter = ['element', 'combat_role']
    search_fields = ['name', 'display_name']
    ordering = ['sort_order']


@admin.register(General)
class GeneralAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'threat_type', 'region', 'chapter_number', 'saga', 'battle_phases']
    list_filter = ['threat_type', 'saga']
    search_fields = ['name', 'display_name']
    ordering = ['sort_order']


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = [
        'display_name', 'user', 'level', 'total_xp', 'total_score',
        'current_chapter', 'luntian_form', 'eco_rank',
        'guardians_awakened', 'generals_defeated', 'trees_planted'
    ]
    list_filter = ['level', 'luntian_form', 'eco_rank', 'current_saga']
    search_fields = ['display_name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['active_guardians']


@admin.register(GameState)
class GameStateAdmin(admin.ModelAdmin):
    list_display = ['player', 'slot_number', 'current_region', 'current_chapter', 'current_saga', 'saved_at']
    list_filter = ['current_saga', 'slot_number']
    search_fields = ['player__display_name']
    readonly_fields = ['saved_at']


@admin.register(ChapterProgress)
class ChapterProgressAdmin(admin.ModelAdmin):
    list_display = [
        'player', 'saga', 'chapter_number', 'chapter_title',
        'status', 'score', 'completion_percentage',
        'guardian_awakened', 'general_defeated'
    ]
    list_filter = ['status', 'saga', 'chapter_number']
    search_fields = ['player__display_name', 'chapter_title']


@admin.register(BattleRecord)
class BattleRecordAdmin(admin.ModelAdmin):
    list_display = [
        'player', 'battle_type', 'enemy_name', 'won',
        'score', 'xp_earned', 'guardian_used',
        'battle_duration_seconds', 'created_at'
    ]
    list_filter = ['battle_type', 'won', 'guardian_used']
    search_fields = ['player__display_name', 'enemy_name']
    readonly_fields = ['created_at']


@admin.register(EnvironmentalMeter)
class EnvironmentalMeterAdmin(admin.ModelAdmin):
    list_display = ['player', 'region', 'meter_type', 'value', 'visual_state', 'updated_at']
    list_filter = ['meter_type', 'region']
    search_fields = ['player__display_name']
    readonly_fields = ['updated_at']

    def visual_state(self, obj):
        return obj.visual_state
    visual_state.short_description = 'Visual State'


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'achievement_type', 'rarity', 'points', 'is_hidden']
    list_filter = ['achievement_type', 'rarity', 'is_hidden']
    search_fields = ['name', 'code', 'name_filipino']


@admin.register(PlayerAchievement)
class PlayerAchievementAdmin(admin.ModelAdmin):
    list_display = ['player', 'achievement', 'unlocked_at']
    search_fields = ['player__display_name', 'achievement__name']
    readonly_fields = ['unlocked_at']


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ['rank', 'player', 'leaderboard_type', 'total_score', 'chapters_completed', 'trees_planted', 'last_updated']
    list_filter = ['leaderboard_type']
    ordering = ['leaderboard_type', 'rank']


@admin.register(EnvironmentalData)
class EnvironmentalDataAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'impact_level', 'related_chapter', 'related_region', 'is_codex_entry']
    list_filter = ['category', 'impact_level', 'is_codex_entry']
    search_fields = ['title', 'title_filipino', 'content']


@admin.register(GameMessage)
class GameMessageAdmin(admin.ModelAdmin):
    list_display = ['key', 'message_type', 'chapter', 'speaker', 'sort_order']
    list_filter = ['message_type', 'chapter']
    search_fields = ['key', 'text_english', 'text_filipino', 'speaker']