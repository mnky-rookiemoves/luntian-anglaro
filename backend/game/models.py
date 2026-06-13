"""
🌿 LUNTIAN ANGLARO — Game Models
"Luntiang Puso, Luntiang Gawa"

13 Models powering the web companion for
LUNTIAN: Guardians of the Environment

Aligned with:
- Game Concept & Story Guide (2 Sagas, 12 Chapters)
- Game Type - Modules and its Surroundings (Kalikasan Engine)
- Developer Toolkit Blueprint
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================
# 🗺️ REGION — Philippine Regions
# ============================================================

class Region(models.Model):
    """
    Regions of the Philippines where the story unfolds.
    Each region has its own environment meters (Kalikasan Engine).
    """

    class RegionCode(models.TextChoices):
        METRO_MANILA = 'NCR', 'Metro Manila (NCR)'
        MANILA_BAY = 'MNL_BAY', 'Manila Bay'
        CORDILLERA = 'CAR', 'Cordillera (CAR)'
        MINDANAO_FOREST = 'MIN_FOR', 'Mindanao Forest'
        TUBBATAHA = 'TUB', 'Tubbataha Reef'
        PUNONG_BAYAN = 'HUB', 'Punong Bayan (Hub Town)'

    code = models.CharField(
        max_length=10,
        choices=RegionCode.choices,
        unique=True,
        help_text="Region identifier code"
    )
    name = models.CharField(max_length=100)
    name_filipino = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    description_filipino = models.TextField(blank=True)
    chapter_number = models.PositiveIntegerField(
        help_text="Which story chapter this region belongs to"
    )
    saga = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(2)],
        help_text="1 = Ang Paggising, 2 = Ang Pagkabulok"
    )
    is_unlocked_by_default = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'chapter_number']
        verbose_name = '🗺️ Region'
        verbose_name_plural = '🗺️ Regions'

    def __str__(self):
        return f"{self.name} (Ch.{self.chapter_number})"


# ============================================================
# 🛡️ GUARDIAN — The 5 Elemental Guardians
# ============================================================

class Guardian(models.Model):
    """
    The 5 Guardians of the Environment:
    Luntian (Nature), Alon (Water), Bulkan (Earth/Fire),
    Haribon (Wind), Pawikan (Ocean/Marine)
    """

    class Element(models.TextChoices):
        NATURE = 'NATURE', '🌱 Nature'
        WATER = 'WATER', '🌊 Water'
        EARTH = 'EARTH', '🌋 Earth'
        WIND = 'WIND', '🦅 Wind'
        MARINE = 'MARINE', '🐢 Marine'

    class CombatRole(models.TextChoices):
        BALANCED = 'BALANCED', 'Balanced'
        AOE_HEALER = 'AOE_HEALER', 'AoE Damage + Healing'
        TANK = 'TANK', 'Tank — Defense + Heavy Damage'
        SPEED = 'SPEED', 'Speed — Mobility + Ranged'
        SUPPORT = 'SUPPORT', 'Support — CC + Defense'

    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    display_name_filipino = models.CharField(max_length=100, blank=True)
    element = models.CharField(max_length=10, choices=Element.choices)
    combat_role = models.CharField(max_length=15, choices=CombatRole.choices)
    region = models.OneToOneField(
        Region, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='guardian',
        help_text="The region where this guardian is awakened"
    )
    awakening_chapter = models.PositiveIntegerField(
        help_text="Chapter number when this guardian can be awakened"
    )
    # Powers (3 per guardian)
    power_1 = models.CharField(max_length=50, help_text="Primary ability")
    power_2 = models.CharField(max_length=50, help_text="Secondary ability")
    power_3 = models.CharField(max_length=50, help_text="Ultimate ability")
    # Lore
    description = models.TextField(blank=True)
    description_filipino = models.TextField(blank=True)
    lore = models.TextField(blank=True, help_text="Backstory and mythology")
    # Sprite reference
    sprite_key = models.CharField(
        max_length=50, blank=True,
        help_text="Key for frontend sprite lookup"
    )
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'awakening_chapter']
        verbose_name = '🛡️ Guardian'
        verbose_name_plural = '🛡️ Guardians'

    def __str__(self):
        return f"{self.display_name} ({self.get_element_display()})"


# ============================================================
# 💀 GENERAL — Villain Bosses
# ============================================================

class General(models.Model):
    """
    The Generals of Pollution — the villain bosses.
    Usok, Mantsa, Hukay, Putol, Lason + final boss Ang Dumi
    """

    class ThreatType(models.TextChoices):
        AIR_POLLUTION = 'AIR', '💨 Air Pollution'
        WATER_POLLUTION = 'WATER', '🏭 Water Pollution'
        MINING_DESTRUCTION = 'MINING', '⛏️ Mining/Land Destruction'
        DEFORESTATION = 'FOREST', '🪓 Deforestation'
        OCEAN_POLLUTION = 'OCEAN', '🌊 Ocean Pollution'
        CORRUPTION = 'CORRUPT', '🏛️ Corruption (Saga II)'
        FINAL_BOSS = 'FINAL', '☠️ Final Boss'

    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    display_name_filipino = models.CharField(max_length=100, blank=True)
    threat_type = models.CharField(max_length=10, choices=ThreatType.choices)
    region = models.OneToOneField(
        Region, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='general',
        help_text="The region where this general resides"
    )
    chapter_number = models.PositiveIntegerField(
        help_text="Chapter where this general is fought"
    )
    saga = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(2)]
    )
    battle_phases = models.PositiveSmallIntegerField(
        default=3,
        help_text="Number of phases in the boss fight"
    )
    description = models.TextField(blank=True)
    description_filipino = models.TextField(blank=True)
    weakness_element = models.CharField(
        max_length=10,
        choices=Guardian.Element.choices,
        blank=True,
        help_text="Which guardian element is most effective"
    )
    sprite_key = models.CharField(max_length=50, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'chapter_number']
        verbose_name = '💀 General'
        verbose_name_plural = '💀 Generals'

    def __str__(self):
        return f"{self.display_name} ({self.get_threat_type_display()})"


# ============================================================
# 👤 PLAYER PROFILE — Player Identity & Progression
# ============================================================

class PlayerProfile(models.Model):
    """
    Player profile with progression tracking.
    Supports anonymous aliases (privacy-first, like Solace).
    """

    class LuntianForm(models.TextChoices):
        SEEDLING = 'SEEDLING', '🌱 Binhi (Seedling)'
        SPROUT = 'SPROUT', '🌿 Supling (Sprout)'
        SAPLING = 'SAPLING', '🌳 Punla (Sapling)'
        TREE = 'TREE', '🌲 Puno (Tree)'
        ANCIENT = 'ANCIENT', '🌴 Punong Kahoy (Ancient Tree)'

    class EcoRank(models.TextChoices):
        VOLUNTEER = 'VOLUNTEER', 'Volunteer'
        ADVOCATE = 'ADVOCATE', 'Advocate'
        GUARDIAN = 'GUARDIAN', 'Guardian'
        CHAMPION = 'CHAMPION', 'Champion'
        BANTAY = 'BANTAY', 'Bantay ng Kalikasan'

    user = models.OneToOneField(
        User, on_delete=models.CASCADE,
        related_name='player_profile',
        null=True, blank=True,
        help_text="Optional — supports anonymous play"
    )
    display_name = models.CharField(
        max_length=50,
        help_text="Player's display name or alias"
    )
    # Progression
    level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveIntegerField(default=0)
    total_score = models.PositiveIntegerField(default=0)
    current_chapter = models.PositiveIntegerField(default=1)
    current_saga = models.PositiveSmallIntegerField(default=1)
    luntian_form = models.CharField(
        max_length=10,
        choices=LuntianForm.choices,
        default=LuntianForm.SEEDLING
    )
    eco_rank = models.CharField(
        max_length=10,
        choices=EcoRank.choices,
        default=EcoRank.VOLUNTEER
    )
    # Guardian tracking
    guardians_awakened = models.PositiveSmallIntegerField(default=0)
    generals_defeated = models.PositiveSmallIntegerField(default=0)
    active_guardians = models.ManyToManyField(
        Guardian, blank=True,
        related_name='players',
        help_text="Guardians this player has awakened"
    )
    # Stats
    trees_planted = models.PositiveIntegerField(
        default=0,
        help_text="Total trees planted in-game (Tanim Tracker)"
    )
    total_play_time_seconds = models.PositiveIntegerField(default=0)
    battles_won = models.PositiveIntegerField(default=0)
    battles_lost = models.PositiveIntegerField(default=0)
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_played = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-total_score']
        verbose_name = '👤 Player Profile'
        verbose_name_plural = '👤 Player Profiles'

    def __str__(self):
        return f"{self.display_name} (Lv.{self.level} — {self.get_luntian_form_display()})"

    @property
    def win_rate(self):
        total = self.battles_won + self.battles_lost
        if total == 0:
            return 0
        return round((self.battles_won / total) * 100, 1)


# ============================================================
# 💾 GAME STATE — Save/Load System
# ============================================================

class GameState(models.Model):
    """
    Full game save state for a player.
    Supports multiple save slots.
    """

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='save_slots'
    )
    slot_number = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(3)],
        help_text="Save slot (1-3)"
    )
    current_region = models.ForeignKey(
        Region, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    current_chapter = models.PositiveIntegerField(default=1)
    current_saga = models.PositiveSmallIntegerField(default=1)
    # Serialized game data (JSON for flexible storage)
    inventory_data = models.JSONField(
        default=dict, blank=True,
        help_text="Player inventory (items, equipment, crafting materials)"
    )
    quest_data = models.JSONField(
        default=dict, blank=True,
        help_text="Active and completed quests"
    )
    environment_data = models.JSONField(
        default=dict, blank=True,
        help_text="Kalikasan Engine state per region"
    )
    # Timestamps
    saved_at = models.DateTimeField(auto_now=True)
    play_time_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-saved_at']
        unique_together = ['player', 'slot_number']
        verbose_name = '💾 Game State'
        verbose_name_plural = '💾 Game States'

    def __str__(self):
        return f"{self.player.display_name} — Slot {self.slot_number} (Ch.{self.current_chapter})"


# ============================================================
# 📖 CHAPTER PROGRESS — Per-Chapter Tracking
# ============================================================

class ChapterProgress(models.Model):
    """
    Tracks player progress through each chapter.
    Aligned with 2-Saga, 12-Chapter structure.
    """

    class Status(models.TextChoices):
        LOCKED = 'LOCKED', '🔒 Locked'
        UNLOCKED = 'UNLOCKED', '🔓 Unlocked'
        IN_PROGRESS = 'IN_PROGRESS', '⏳ In Progress'
        COMPLETED = 'COMPLETED', '✅ Completed'

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='chapter_progress'
    )
    chapter_number = models.PositiveIntegerField()
    chapter_title = models.CharField(max_length=100, blank=True)
    chapter_title_filipino = models.CharField(max_length=100, blank=True)
    saga = models.PositiveSmallIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(2)]
    )
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.LOCKED
    )
    score = models.PositiveIntegerField(default=0)
    # Milestones
    guardian_awakened = models.ForeignKey(
        Guardian, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text="Guardian awakened in this chapter"
    )
    general_defeated = models.ForeignKey(
        General, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text="General defeated in this chapter"
    )
    # Completion data
    completion_percentage = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    time_spent_seconds = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['saga', 'chapter_number']
        unique_together = ['player', 'chapter_number', 'saga']
        verbose_name = '📖 Chapter Progress'
        verbose_name_plural = '📖 Chapter Progress'

    def __str__(self):
        return f"{self.player.display_name} — Saga {self.saga}, Ch.{self.chapter_number} ({self.get_status_display()})"


# ============================================================
# ⚔️ BATTLE RECORD — Combat History
# ============================================================

class BattleRecord(models.Model):
    """
    Records every battle — against Generals and regular enemies.
    Tracks which Guardian form was used.
    """

    class BattleType(models.TextChoices):
        BOSS = 'BOSS', '💀 Boss (General)'
        MINION = 'MINION', '👾 Minion'
        ARENA = 'ARENA', '🏟️ Arena (PvP)'
        HORDE = 'HORDE', '🌊 Horde Mode'

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='battle_records'
    )
    battle_type = models.CharField(
        max_length=10,
        choices=BattleType.choices,
        default=BattleType.MINION
    )
    general = models.ForeignKey(
        General, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text="If boss fight, which General"
    )
    enemy_name = models.CharField(
        max_length=100,
        help_text="Name of enemy or General fought"
    )
    chapter_number = models.PositiveIntegerField()
    region = models.ForeignKey(
        Region, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    # Outcome
    won = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)
    xp_earned = models.PositiveIntegerField(default=0)
    # Combat details
    guardian_used = models.ForeignKey(
        Guardian, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='battle_records',
        help_text="Primary guardian form used in battle"
    )
    battle_duration_seconds = models.PositiveIntegerField(default=0)
    damage_dealt = models.PositiveIntegerField(default=0)
    damage_taken = models.PositiveIntegerField(default=0)
    combos_landed = models.PositiveIntegerField(default=0)
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = '⚔️ Battle Record'
        verbose_name_plural = '⚔️ Battle Records'

    def __str__(self):
        result = "🏆 WON" if self.won else "💀 LOST"
        return f"{self.player.display_name} vs {self.enemy_name} — {result}"


# ============================================================
# 🌍 ENVIRONMENTAL METER — Kalikasan Engine
# ============================================================

class EnvironmentalMeter(models.Model):
    """
    The Kalikasan Engine — each region has 5 environment meters.
    These meters drive visual state changes in the game world.

    0-25%  → DEAD (gray, silent, barren)
    26-50% → DYING (brown, sparse life)
    51-75% → HEALING (green patches grow)
    76-100%→ THRIVING (lush, vibrant, alive)
    """

    class MeterType(models.TextChoices):
        FOREST = 'FOREST', '🌳 Forest Health'
        WATER = 'WATER', '💧 Water Purity'
        AIR = 'AIR', '🌬️ Air Quality'
        WILDLIFE = 'WILDLIFE', '🐾 Wildlife Population'
        GOVERNANCE = 'GOVERNANCE', '🏛️ Governance (Saga II)'

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='env_meters'
    )
    region = models.ForeignKey(
        Region, on_delete=models.CASCADE,
        related_name='env_meters'
    )
    meter_type = models.CharField(max_length=12, choices=MeterType.choices)
    value = models.FloatField(
        default=50.0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="0-100 percentage"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['region', 'meter_type']
        unique_together = ['player', 'region', 'meter_type']
        verbose_name = '🌍 Environmental Meter'
        verbose_name_plural = '🌍 Environmental Meters'

    def __str__(self):
        return f"{self.region.name} — {self.get_meter_type_display()}: {self.value}%"

    @property
    def visual_state(self):
        """Returns the visual state based on meter value."""
        if self.value <= 25:
            return 'DEAD'
        elif self.value <= 50:
            return 'DYING'
        elif self.value <= 75:
            return 'HEALING'
        return 'THRIVING'


# ============================================================
# 🏆 ACHIEVEMENT — Achievement Definitions
# ============================================================

class Achievement(models.Model):
    """
    Achievement definitions with rarity tiers.
    """

    class AchievementType(models.TextChoices):
        STORY = 'STORY', '📖 Story'
        COMBAT = 'COMBAT', '⚔️ Combat'
        EXPLORATION = 'EXPLORATION', '🗺️ Exploration'
        ENVIRONMENTAL = 'ENVIRONMENTAL', '🌿 Environmental'
        COMMUNITY = 'COMMUNITY', '👥 Community'
        SECRET = 'SECRET', '🔮 Secret'

    class Rarity(models.TextChoices):
        COMMON = 'COMMON', '⬜ Common'
        UNCOMMON = 'UNCOMMON', '🟩 Uncommon'
        RARE = 'RARE', '🟦 Rare'
        EPIC = 'EPIC', '🟪 Epic'
        LEGENDARY = 'LEGENDARY', '🟨 Legendary'

    name = models.CharField(max_length=100)
    name_filipino = models.CharField(max_length=100, blank=True)
    code = models.CharField(max_length=50, unique=True)
    achievement_type = models.CharField(
        max_length=15, choices=AchievementType.choices
    )
    rarity = models.CharField(
        max_length=10, choices=Rarity.choices,
        default=Rarity.COMMON
    )
    description = models.TextField(blank=True)
    description_filipino = models.TextField(blank=True)
    points = models.PositiveIntegerField(default=10)
    icon_key = models.CharField(
        max_length=50, blank=True,
        help_text="Key for frontend icon lookup"
    )
    is_hidden = models.BooleanField(
        default=False,
        help_text="Hidden until unlocked (for secrets)"
    )

    class Meta:
        ordering = ['achievement_type', '-points']
        verbose_name = '🏆 Achievement'
        verbose_name_plural = '🏆 Achievements'

    def __str__(self):
        return f"{self.name} ({self.get_rarity_display()} — {self.points}pts)"


# ============================================================
# 🎖️ PLAYER ACHIEVEMENT — Junction Table
# ============================================================

class PlayerAchievement(models.Model):
    """Player ↔ Achievement mapping with unlock timestamp."""

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='achievements'
    )
    achievement = models.ForeignKey(
        Achievement, on_delete=models.CASCADE,
        related_name='unlocked_by'
    )
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['player', 'achievement']
        ordering = ['-unlocked_at']
        verbose_name = '🎖️ Player Achievement'
        verbose_name_plural = '🎖️ Player Achievements'

    def __str__(self):
        return f"{self.player.display_name} 🏆 {self.achievement.name}"


# ============================================================
# 📊 LEADERBOARD ENTRY — Rankings
# ============================================================

class LeaderboardEntry(models.Model):
    """
    Leaderboard with eco-ranks and community scores.
    """

    class LeaderboardType(models.TextChoices):
        OVERALL = 'OVERALL', '🌍 Overall'
        COMBAT = 'COMBAT', '⚔️ Combat'
        ENVIRONMENTAL = 'ENV', '🌿 Environmental'
        COMMUNITY = 'COMMUNITY', '👥 Community'
        WEEKLY = 'WEEKLY', '📅 Weekly Challenge'

    player = models.ForeignKey(
        PlayerProfile, on_delete=models.CASCADE,
        related_name='leaderboard_entries'
    )
    leaderboard_type = models.CharField(
        max_length=10, choices=LeaderboardType.choices,
        default=LeaderboardType.OVERALL
    )
    rank = models.PositiveIntegerField(default=0)
    total_score = models.PositiveIntegerField(default=0)
    chapters_completed = models.PositiveIntegerField(default=0)
    trees_planted = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['leaderboard_type', 'rank']
        unique_together = ['player', 'leaderboard_type']
        verbose_name = '📊 Leaderboard Entry'
        verbose_name_plural = '📊 Leaderboard Entries'

    def __str__(self):
        return f"#{self.rank} — {self.player.display_name} ({self.total_score} pts)"


# ============================================================
# 📚 ENVIRONMENTAL DATA — Eco-Educational Content
# ============================================================

class EnvironmentalData(models.Model):
    """
    Real-world environmental facts, PH laws, species info.
    Displayed as in-game Lore Codex entries and Eskwelahan content.
    """

    class Category(models.TextChoices):
        PH_LAW = 'LAW', '⚖️ Philippine Law'
        SPECIES = 'SPECIES', '🐾 Endangered Species'
        CLIMATE = 'CLIMATE', '🌡️ Climate Data'
        POLLUTION = 'POLLUTION', '🏭 Pollution Facts'
        CONSERVATION = 'CONSERVATION', '🌱 Conservation'
        HISTORY = 'HISTORY', '📜 Environmental History'

    class ImpactLevel(models.TextChoices):
        LOW = 'LOW', '🟢 Low'
        MEDIUM = 'MEDIUM', '🟡 Medium'
        HIGH = 'HIGH', '🔴 High'
        CRITICAL = 'CRITICAL', '⚫ Critical'

    title = models.CharField(max_length=200)
    title_filipino = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=15, choices=Category.choices)
    impact_level = models.CharField(
        max_length=10, choices=ImpactLevel.choices,
        default=ImpactLevel.MEDIUM
    )
    content = models.TextField()
    content_filipino = models.TextField(blank=True)
    source = models.CharField(
        max_length=255, blank=True,
        help_text="Citation or source URL"
    )
    related_chapter = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Which chapter references this data"
    )
    related_region = models.ForeignKey(
        Region, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='env_data'
    )
    is_codex_entry = models.BooleanField(
        default=True,
        help_text="Show in the in-game Lore Codex"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'title']
        verbose_name = '📚 Environmental Data'
        verbose_name_plural = '📚 Environmental Data'

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


# ============================================================
# 💬 GAME MESSAGE — Bilingual Messaging
# ============================================================

class GameMessage(models.Model):
    """
    Bilingual game messages (English + Filipino).
    Used for dialogue, UI text, tutorials, notifications.
    """

    class MessageType(models.TextChoices):
        DIALOGUE = 'DIALOGUE', '💬 Dialogue'
        TUTORIAL = 'TUTORIAL', '📘 Tutorial'
        NOTIFICATION = 'NOTIFICATION', '🔔 Notification'
        GREETING = 'GREETING', '👋 Greeting'
        LORE = 'LORE', '📜 Lore'
        UI = 'UI', '🖥️ UI Text'
        ACHIEVEMENT = 'ACHIEVEMENT', '🏆 Achievement'
        BATTLE = 'BATTLE', '⚔️ Battle'

    key = models.CharField(
        max_length=100, unique=True,
        help_text="Unique message identifier (e.g., 'ch1_intro_greeting')"
    )
    message_type = models.CharField(
        max_length=15, choices=MessageType.choices
    )
    chapter = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Associated chapter (null = global)"
    )
    speaker = models.CharField(
        max_length=50, blank=True,
        help_text="Who says this (e.g., 'Luntian', 'Alon', 'Narrator')"
    )
    text_english = models.TextField()
    text_filipino = models.TextField()
    # Context
    context = models.CharField(
        max_length=200, blank=True,
        help_text="Where/when this message appears"
    )
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['chapter', 'sort_order']
        verbose_name = '💬 Game Message'
        verbose_name_plural = '💬 Game Messages'

    def __str__(self):
        return f"[{self.get_message_type_display()}] {self.key}"