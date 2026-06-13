"""
🌿 LUNTIAN ANGLARO — Seed Game Data
Seeds Regions, Guardians, Generals, and starter messages.
"""

from django.core.management.base import BaseCommand
from game.models import Region, Guardian, General, GameMessage, Achievement


class Command(BaseCommand):
    help = 'Seeds LUNTIAN game data (Regions, Guardians, Generals, Messages, Achievements)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n🌿 Seeding LUNTIAN ANGLARO game data...\n'))

        # ── Regions ───────────────────────────────────
        regions_data = [
            {'code': 'HUB', 'name': 'Punong Bayan', 'name_filipino': 'Punong Bayan',
             'description': 'Central hub town — quest board, market, training area, Luntian\'s grove',
             'chapter_number': 0, 'saga': 1, 'is_unlocked_by_default': True, 'sort_order': 0},
            {'code': 'NCR', 'name': 'Metro Manila', 'name_filipino': 'Kalakhang Maynila',
             'description': 'The sprawling capital — air pollution, urban decay, and the first awakening',
             'chapter_number': 1, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 1},
            {'code': 'MNL_BAY', 'name': 'Manila Bay', 'name_filipino': 'Look ng Maynila',
             'description': 'The polluted bay — Pasig River, esteros, underwater chambers',
             'chapter_number': 2, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 2},
            {'code': 'CAR', 'name': 'Cordillera', 'name_filipino': 'Kordilyera',
             'description': 'The mountain region — rice terraces, mines, indigenous villages',
             'chapter_number': 3, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 3},
            {'code': 'MIN_FOR', 'name': 'Mindanao Forest', 'name_filipino': 'Kagubatan ng Mindanao',
             'description': 'Dense tropical forest — Mt. Apo, logging sites, eagle nesting grounds',
             'chapter_number': 4, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 4},
            {'code': 'TUB', 'name': 'Tubbataha Reef', 'name_filipino': 'Bahura ng Tubbataha',
             'description': 'Deep ocean reef — underwater world, garbage patches, deep trenches',
             'chapter_number': 5, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 5},
        ]

        regions = {}
        for data in regions_data:
            region, created = Region.objects.update_or_create(
                code=data['code'], defaults=data
            )
            regions[data['code']] = region
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f"  {status}: {region}")

        self.stdout.write(self.style.SUCCESS(f'\n  🗺️ {len(regions)} Regions seeded!\n'))

        # ── Guardians ─────────────────────────────────
        guardians_data = [
            {'name': 'luntian', 'display_name': 'Luntian', 'display_name_filipino': 'Luntian',
             'element': 'NATURE', 'combat_role': 'BALANCED', 'region_code': 'NCR',
             'awakening_chapter': 0, 'power_1': 'Vine Whip', 'power_2': 'Root Shield',
             'power_3': 'Growth Heal', 'description': 'The spirit of nature — your companion from the start',
             'sprite_key': 'guardian_luntian', 'sort_order': 0},
            {'name': 'alon', 'display_name': 'Alon', 'display_name_filipino': 'Alon',
             'element': 'WATER', 'combat_role': 'AOE_HEALER', 'region_code': 'MNL_BAY',
             'awakening_chapter': 2, 'power_1': 'Water Slash', 'power_2': 'Tidal Wave',
             'power_3': 'Purify', 'description': 'Ocean Guardian — majestic water spirit with coral crown',
             'sprite_key': 'guardian_alon', 'sort_order': 1},
            {'name': 'bulkan', 'display_name': 'Bulkan', 'display_name_filipino': 'Bulkan',
             'element': 'EARTH', 'combat_role': 'TANK', 'region_code': 'CAR',
             'awakening_chapter': 3, 'power_1': 'Earth Slam', 'power_2': 'Rock Wall',
             'power_3': 'Seismic Strike', 'description': 'Mountain Guardian — massive stone golem with volcanic lava core',
             'sprite_key': 'guardian_bulkan', 'sort_order': 2},
            {'name': 'haribon', 'display_name': 'Haribon', 'display_name_filipino': 'Haribon',
             'element': 'WIND', 'combat_role': 'SPEED', 'region_code': 'MIN_FOR',
             'awakening_chapter': 4, 'power_1': 'Wind Dash', 'power_2': 'Feather Storm',
             'power_3': 'Sky Strike', 'description': 'Wind Guardian — the Philippine Eagle spirit',
             'sprite_key': 'guardian_haribon', 'sort_order': 3},
            {'name': 'pawikan', 'display_name': 'Pawikan', 'display_name_filipino': 'Pawikan',
             'element': 'MARINE', 'combat_role': 'SUPPORT', 'region_code': 'TUB',
             'awakening_chapter': 5, 'power_1': 'Coral Shield', 'power_2': 'Deep Current',
             'power_3': 'Bubble Trap', 'description': 'Marine Guardian — ancient sea turtle spirit',
             'sprite_key': 'guardian_pawikan', 'sort_order': 4},
        ]

        for data in guardians_data:
            region_code = data.pop('region_code')
            data['region'] = regions.get(region_code)
            guardian, created = Guardian.objects.update_or_create(
                name=data['name'], defaults=data
            )
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f"  {status}: {guardian}")

        self.stdout.write(self.style.SUCCESS(f'\n  🛡️ {len(guardians_data)} Guardians seeded!\n'))

        # ── Generals ──────────────────────────────────
        generals_data = [
            {'name': 'usok', 'display_name': 'Usok', 'display_name_filipino': 'Usok (Usok)',
             'threat_type': 'AIR', 'region_code': 'NCR', 'chapter_number': 1, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'NATURE',
             'description': 'The Smoke General — dark smoke monster born from industrial pollution',
             'sprite_key': 'general_usok', 'sort_order': 0},
            {'name': 'mantsa', 'display_name': 'Mantsa', 'display_name_filipino': 'Mantsa',
             'threat_type': 'WATER', 'region_code': 'MNL_BAY', 'chapter_number': 2, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'WATER',
             'description': 'The Stain General — toxic water creature corrupting Manila Bay',
             'sprite_key': 'general_mantsa', 'sort_order': 1},
            {'name': 'hukay', 'display_name': 'Hukay', 'display_name_filipino': 'Hukay',
             'threat_type': 'MINING', 'region_code': 'CAR', 'chapter_number': 3, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'EARTH',
             'description': 'The Pit General — underground mining destroyer ravaging Cordillera',
             'sprite_key': 'general_hukay', 'sort_order': 2},
            {'name': 'putol', 'display_name': 'Putol', 'display_name_filipino': 'Putol',
             'threat_type': 'FOREST', 'region_code': 'MIN_FOR', 'chapter_number': 4, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'WIND',
             'description': 'The Chainsaw General — deforestation beast destroying Mindanao',
             'sprite_key': 'general_putol', 'sort_order': 3},
            {'name': 'lason', 'display_name': 'Lason', 'display_name_filipino': 'Lason',
             'threat_type': 'OCEAN', 'region_code': 'TUB', 'chapter_number': 5, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'MARINE',
             'description': 'The Poison General — deep sea pollution creature in Tubbataha',
             'sprite_key': 'general_lason', 'sort_order': 4},
            {'name': 'ang_dumi', 'display_name': 'Ang Dumi', 'display_name_filipino': 'Ang Dumi',
             'threat_type': 'FINAL', 'region_code': None, 'chapter_number': 6, 'saga': 1,
             'battle_phases': 5, 'weakness_element': '',
             'description': 'The Final Boss — the embodiment of all pollution and environmental destruction',
             'sprite_key': 'general_ang_dumi', 'sort_order': 5},
        ]

        for data in generals_data:
            region_code = data.pop('region_code')
            data['region'] = regions.get(region_code) if region_code else None
            general, created = General.objects.update_or_create(
                name=data['name'], defaults=data
            )
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f"  {status}: {general}")

        self.stdout.write(self.style.SUCCESS(f'\n  💀 {len(generals_data)} Generals seeded!\n'))

        # ── Starter Achievements ──────────────────────
        achievements_data = [
            {'code': 'FIRST_STEP', 'name': 'Ang Unang Hakbang', 'name_filipino': 'Ang Unang Hakbang',
             'achievement_type': 'STORY', 'rarity': 'COMMON', 'points': 10,
             'description': 'Begin your journey as a Guardian of the Environment'},
            {'code': 'FIRST_BLOOD', 'name': 'Unang Laban', 'name_filipino': 'Unang Laban',
             'achievement_type': 'COMBAT', 'rarity': 'COMMON', 'points': 10,
             'description': 'Win your first battle'},
            {'code': 'TREE_HUGGER', 'name': 'Yumayakap sa Puno', 'name_filipino': 'Yumayakap sa Puno',
             'achievement_type': 'ENVIRONMENTAL', 'rarity': 'UNCOMMON', 'points': 25,
             'description': 'Plant 100 trees in-game'},
            {'code': 'GUARDIAN_AWAKENER', 'name': 'Tagapagpukaw', 'name_filipino': 'Tagapagpukaw',
             'achievement_type': 'STORY', 'rarity': 'RARE', 'points': 50,
             'description': 'Awaken your first Guardian'},
            {'code': 'GENERAL_SLAYER', 'name': 'Manlulupig', 'name_filipino': 'Manlulupig',
             'achievement_type': 'COMBAT', 'rarity': 'RARE', 'points': 50,
             'description': 'Defeat your first General'},
            {'code': 'ALL_GUARDIANS', 'name': 'Limang Elemento', 'name_filipino': 'Limang Elemento',
             'achievement_type': 'STORY', 'rarity': 'EPIC', 'points': 100,
             'description': 'Awaken all 5 Guardians'},
            {'code': 'SAGA_COMPLETE', 'name': 'Ang Paggising', 'name_filipino': 'Ang Paggising',
             'achievement_type': 'STORY', 'rarity': 'LEGENDARY', 'points': 500,
             'description': 'Complete Saga I — The Awakening'},
            {'code': 'BANTAY', 'name': 'Bantay ng Kalikasan', 'name_filipino': 'Bantay ng Kalikasan',
             'achievement_type': 'COMMUNITY', 'rarity': 'LEGENDARY', 'points': 1000,
             'description': 'Reach the highest Eco Rank', 'is_hidden': True},
        ]

        for data in achievements_data:
            is_hidden = data.pop('is_hidden', False)
            achievement, created = Achievement.objects.update_or_create(
                code=data['code'], defaults={**data, 'is_hidden': is_hidden}
            )
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f"  {status}: {achievement}")

        self.stdout.write(self.style.SUCCESS(f'\n  🏆 {len(achievements_data)} Achievements seeded!\n'))

        # ── Starter Messages ──────────────────────────
        messages_data = [
            {'key': 'welcome_greeting', 'message_type': 'GREETING', 'speaker': 'Luntian',
             'text_english': 'Welcome, Guardian. The land calls for your help.',
             'text_filipino': 'Maligayang pagdating, Tagapag-alaga. Tumatawag ang lupa para sa iyong tulong.'},
            {'key': 'ch1_intro', 'message_type': 'DIALOGUE', 'chapter': 1, 'speaker': 'Narrator',
             'text_english': 'Metro Manila chokes under a blanket of gray smoke. The air burns.',
             'text_filipino': 'Nasakal ang Kalakhang Maynila sa kumot ng abo. Nasusunog ang hangin.'},
            {'key': 'first_battle', 'message_type': 'BATTLE', 'speaker': 'Luntian',
             'text_english': 'Stand firm! The Dumi creatures are coming!',
             'text_filipino': 'Tumayo nang matatag! Paparating na ang mga nilalang ng Dumi!'},
            {'key': 'tree_planted', 'message_type': 'NOTIFICATION', 'speaker': 'System',
             'text_english': '🌳 A tree has been planted! The earth remembers.',
             'text_filipino': '🌳 May punong naitanim! Naalala ng lupa.'},
        ]

        for data in messages_data:
            msg, created = GameMessage.objects.update_or_create(
                key=data['key'], defaults=data
            )
            status = '✅ Created' if created else '🔄 Updated'
            self.stdout.write(f"  {status}: {msg}")

        self.stdout.write(self.style.SUCCESS(f'\n  💬 {len(messages_data)} Messages seeded!'))

        # ── Summary ───────────────────────────────────
        self.stdout.write(self.style.SUCCESS('''
╔══════════════════════════════════════════════════╗
║     🌿 LUNTIAN ANGLARO — SEED COMPLETE!         ║
║                                                  ║
║     🗺️  6 Regions                                ║
║     🛡️  5 Guardians                              ║
║     💀  6 Generals                               ║
║     🏆  8 Achievements                           ║
║     💬  4 Game Messages                          ║
║                                                  ║
║     "Luntiang Puso, Luntiang Gawa" 💚            ║
╚══════════════════════════════════════════════════╝
        '''))