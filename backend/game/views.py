"""
🌿 LUNTIAN ANGLARO — API Views
Read-only ViewSets for game data + CRUD for player data
"""

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (
    Region, Guardian, General, PlayerProfile, GameState,
    ChapterProgress, BattleRecord, EnvironmentalMeter,
    Achievement, PlayerAchievement, LeaderboardEntry,
    EnvironmentalData, GameMessage
)
from .serializers import (
    RegionSerializer, GuardianSerializer, GeneralSerializer,
    PlayerProfileSerializer, GameStateSerializer,
    ChapterProgressSerializer, BattleRecordSerializer,
    EnvironmentalMeterSerializer, AchievementSerializer,
    PlayerAchievementSerializer, LeaderboardEntrySerializer,
    EnvironmentalDataSerializer, GameMessageSerializer
)


# ── Health Check ──────────────────────────────────────────

@api_view(['GET'])
def api_health(request):
    """API health check endpoint."""
    return Response({
        'status': 'ok',
        'game': 'LUNTIAN ANGLARO',
        'tagline': 'Luntiang Puso, Luntiang Gawa',
        'version': '0.1.0',
    })


# ── Read-Only Game Data ───────────────────────────────────

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]


class GuardianViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Guardian.objects.select_related('region').all()
    serializer_class = GuardianSerializer
    permission_classes = [permissions.AllowAny]


class GeneralViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = General.objects.select_related('region').all()
    serializer_class = GeneralSerializer
    permission_classes = [permissions.AllowAny]


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        # Filter hidden achievements unless requested
        show_hidden = self.request.query_params.get('show_hidden', 'false')
        if show_hidden.lower() != 'true':
            qs = qs.filter(is_hidden=False)
        return qs


class EnvironmentalDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EnvironmentalData.objects.select_related('related_region').all()
    serializer_class = EnvironmentalDataSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        chapter = self.request.query_params.get('chapter')
        if category:
            qs = qs.filter(category=category)
        if chapter:
            qs = qs.filter(related_chapter=chapter)
        return qs


class GameMessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GameMessage.objects.all()
    serializer_class = GameMessageSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        msg_type = self.request.query_params.get('type')
        chapter = self.request.query_params.get('chapter')
        if msg_type:
            qs = qs.filter(message_type=msg_type)
        if chapter:
            qs = qs.filter(chapter=chapter)
        return qs


# ── Leaderboard (Public Read) ────────────────────────────

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeaderboardEntry.objects.select_related('player').all()
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        board_type = self.request.query_params.get('type', 'OVERALL')
        return qs.filter(leaderboard_type=board_type)[:100]


# ── Player Data (Future: Auth-Protected) ─────────────────

class PlayerProfileViewSet(viewsets.ModelViewSet):
    queryset = PlayerProfile.objects.prefetch_related('active_guardians').all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Lock down with JWT


class BattleRecordViewSet(viewsets.ModelViewSet):
    queryset = BattleRecord.objects.select_related(
        'player', 'general', 'guardian_used', 'region'
    ).all()
    serializer_class = BattleRecordSerializer
    permission_classes = [permissions.AllowAny]


class ChapterProgressViewSet(viewsets.ModelViewSet):
    queryset = ChapterProgress.objects.select_related(
        'player', 'guardian_awakened', 'general_defeated'
    ).all()
    serializer_class = ChapterProgressSerializer
    permission_classes = [permissions.AllowAny]


class EnvironmentalMeterViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalMeter.objects.select_related('player', 'region').all()
    serializer_class = EnvironmentalMeterSerializer
    permission_classes = [permissions.AllowAny]