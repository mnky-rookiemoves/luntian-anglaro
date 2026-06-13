"""
🌿 LUNTIAN ANGLARO — URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Game data (read-only)
router.register(r'regions', views.RegionViewSet)
router.register(r'guardians', views.GuardianViewSet)
router.register(r'generals', views.GeneralViewSet)
router.register(r'achievements', views.AchievementViewSet)
router.register(r'eco-data', views.EnvironmentalDataViewSet)
router.register(r'messages', views.GameMessageViewSet)
router.register(r'leaderboard', views.LeaderboardViewSet)

# Player data (CRUD)
router.register(r'players', views.PlayerProfileViewSet)
router.register(r'battles', views.BattleRecordViewSet)
router.register(r'chapters', views.ChapterProgressViewSet)
router.register(r'env-meters', views.EnvironmentalMeterViewSet)

urlpatterns = [
    path('health/', views.api_health, name='api-health'),
    path('', include(router.urls)),
]