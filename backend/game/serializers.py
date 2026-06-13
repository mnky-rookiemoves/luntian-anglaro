"""
🌿 LUNTIAN ANGLARO — DRF Serializers
"""

from rest_framework import serializers
from .models import (
    Region, Guardian, General, PlayerProfile, GameState,
    ChapterProgress, BattleRecord, EnvironmentalMeter,
    Achievement, PlayerAchievement, LeaderboardEntry,
    EnvironmentalData, GameMessage
)


class RegionSerializer(serializers.ModelSerializer):
    guardian_name = serializers.CharField(source='guardian.display_name', read_only=True, default=None)
    general_name = serializers.CharField(source='general.display_name', read_only=True, default=None)

    class Meta:
        model = Region
        fields = '__all__'


class GuardianSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True, default=None)
    element_display = serializers.CharField(source='get_element_display', read_only=True)
    combat_role_display = serializers.CharField(source='get_combat_role_display', read_only=True)

    class Meta:
        model = Guardian
        fields = '__all__'


class GeneralSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True, default=None)
    threat_display = serializers.CharField(source='get_threat_type_display', read_only=True)

    class Meta:
        model = General
        fields = '__all__'


class PlayerProfileSerializer(serializers.ModelSerializer):
    luntian_form_display = serializers.CharField(source='get_luntian_form_display', read_only=True)
    eco_rank_display = serializers.CharField(source='get_eco_rank_display', read_only=True)
    win_rate = serializers.FloatField(read_only=True)
    active_guardians = GuardianSerializer(many=True, read_only=True)

    class Meta:
        model = PlayerProfile
        exclude = ['user']
        read_only_fields = ['created_at', 'updated_at']


class GameStateSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='current_region.name', read_only=True, default=None)

    class Meta:
        model = GameState
        fields = '__all__'
        read_only_fields = ['saved_at']


class ChapterProgressSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    guardian_name = serializers.CharField(source='guardian_awakened.display_name', read_only=True, default=None)
    general_name = serializers.CharField(source='general_defeated.display_name', read_only=True, default=None)

    class Meta:
        model = ChapterProgress
        fields = '__all__'


class BattleRecordSerializer(serializers.ModelSerializer):
    battle_type_display = serializers.CharField(source='get_battle_type_display', read_only=True)
    guardian_name = serializers.CharField(source='guardian_used.display_name', read_only=True, default=None)

    class Meta:
        model = BattleRecord
        fields = '__all__'
        read_only_fields = ['created_at']


class EnvironmentalMeterSerializer(serializers.ModelSerializer):
    meter_display = serializers.CharField(source='get_meter_type_display', read_only=True)
    visual_state = serializers.CharField(read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)

    class Meta:
        model = EnvironmentalMeter
        fields = '__all__'
        read_only_fields = ['updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_achievement_type_display', read_only=True)
    rarity_display = serializers.CharField(source='get_rarity_display', read_only=True)

    class Meta:
        model = Achievement
        fields = '__all__'


class PlayerAchievementSerializer(serializers.ModelSerializer):
    achievement_detail = AchievementSerializer(source='achievement', read_only=True)

    class Meta:
        model = PlayerAchievement
        fields = '__all__'
        read_only_fields = ['unlocked_at']


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.display_name', read_only=True)
    player_form = serializers.CharField(source='player.get_luntian_form_display', read_only=True)

    class Meta:
        model = LeaderboardEntry
        fields = '__all__'


class EnvironmentalDataSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    impact_display = serializers.CharField(source='get_impact_level_display', read_only=True)

    class Meta:
        model = EnvironmentalData
        fields = '__all__'


class GameMessageSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_message_type_display', read_only=True)

    class Meta:
        model = GameMessage
        fields = '__all__'