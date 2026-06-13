"""
🌿 LUNTIAN ANGLARO — Seed Game Data
Seeds Regions, Guardians, Generals, Messages, Achievements,
Environmental Data (Codex), and more.
"""

from django.core.management.base import BaseCommand
from game.models import Region, Guardian, General, GameMessage, Achievement, EnvironmentalData


class Command(BaseCommand):
    help = 'Seeds LUNTIAN game data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n🌿 Seeding LUNTIAN ANGLARO game data...\n'))

        regions = self._seed_regions()
        self._seed_guardians(regions)
        self._seed_generals(regions)
        self._seed_achievements()
        self._seed_messages()
        self._seed_codex(regions)

        self.stdout.write(self.style.SUCCESS('''
╔══════════════════════════════════════════════════╗
║     🌿 LUNTIAN ANGLARO — SEED COMPLETE!         ║
║     "Luntiang Puso, Luntiang Gawa" 💚            ║
╚══════════════════════════════════════════════════╝
        '''))

    # ── REGIONS ───────────────────────────────────────
    def _seed_regions(self):
        data = [
            {'code': 'HUB', 'name': 'Punong Bayan', 'name_filipino': 'Punong Bayan',
             'description': 'Central hub town — quest board, market, training area, Luntian\'s grove',
             'description_filipino': 'Sentral na bayan — board ng quest, palengke, training area, grove ni Luntian',
             'chapter_number': 0, 'saga': 1, 'is_unlocked_by_default': True, 'sort_order': 0},
            {'code': 'NCR', 'name': 'Metro Manila', 'name_filipino': 'Kalakhang Maynila',
             'description': 'The sprawling capital — air pollution, urban decay, and the first awakening',
             'description_filipino': 'Ang malawak na kabisera — polusyon sa hangin, pagkasira ng lungsod, at ang unang paggising',
             'chapter_number': 1, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 1},
            {'code': 'MNL_BAY', 'name': 'Manila Bay', 'name_filipino': 'Look ng Maynila',
             'description': 'The polluted bay — Pasig River, esteros, underwater chambers',
             'description_filipino': 'Ang maruming look — Ilog Pasig, mga estero, mga silid sa ilalim ng tubig',
             'chapter_number': 2, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 2},
            {'code': 'CAR', 'name': 'Cordillera', 'name_filipino': 'Kordilyera',
             'description': 'The mountain region — rice terraces, mines, indigenous villages',
             'description_filipino': 'Ang rehiyon ng kabundukan — rice terraces, mga minahan, mga katutubo',
             'chapter_number': 3, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 3},
            {'code': 'MIN_FOR', 'name': 'Mindanao Forest', 'name_filipino': 'Kagubatan ng Mindanao',
             'description': 'Dense tropical forest — Mt. Apo, logging sites, eagle nesting grounds',
             'description_filipino': 'Makapal na tropikal na kagubatan — Mt. Apo, mga logging site, pugad ng agila',
             'chapter_number': 4, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 4},
            {'code': 'TUB', 'name': 'Tubbataha Reef', 'name_filipino': 'Bahura ng Tubbataha',
             'description': 'Deep ocean reef — underwater world, garbage patches, deep trenches',
             'description_filipino': 'Malalim na bahura — mundo sa ilalim ng dagat, mga basura, malalim na trench',
             'chapter_number': 5, 'saga': 1, 'is_unlocked_by_default': False, 'sort_order': 5},
        ]
        regions = {}
        for d in data:
            obj, created = Region.objects.update_or_create(code=d['code'], defaults=d)
            regions[d['code']] = obj
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  🗺️ {len(regions)} Regions seeded!\n'))
        return regions

    # ── GUARDIANS ─────────────────────────────────────
    def _seed_guardians(self, regions):
        data = [
            {'name': 'luntian', 'display_name': 'Luntian', 'display_name_filipino': 'Luntian',
             'element': 'NATURE', 'combat_role': 'BALANCED', 'region_code': 'NCR',
             'awakening_chapter': 0, 'power_1': 'Vine Whip', 'power_2': 'Root Shield',
             'power_3': 'Growth Heal', 'description': 'The spirit of nature — your companion from the start',
             'description_filipino': 'Ang espiritu ng kalikasan — kasama mo mula sa simula',
             'sprite_key': 'guardian_luntian', 'sort_order': 0},
            {'name': 'alon', 'display_name': 'Alon', 'display_name_filipino': 'Alon',
             'element': 'WATER', 'combat_role': 'AOE_HEALER', 'region_code': 'MNL_BAY',
             'awakening_chapter': 2, 'power_1': 'Water Slash', 'power_2': 'Tidal Wave',
             'power_3': 'Purify', 'description': 'Ocean Guardian — majestic water spirit with coral crown',
             'description_filipino': 'Tagapag-alaga ng Karagatan — maringal na espiritu ng tubig na may korona ng korales',
             'sprite_key': 'guardian_alon', 'sort_order': 1},
            {'name': 'bulkan', 'display_name': 'Bulkan', 'display_name_filipino': 'Bulkan',
             'element': 'EARTH', 'combat_role': 'TANK', 'region_code': 'CAR',
             'awakening_chapter': 3, 'power_1': 'Earth Slam', 'power_2': 'Rock Wall',
             'power_3': 'Seismic Strike', 'description': 'Mountain Guardian — massive stone golem with volcanic lava core',
             'description_filipino': 'Tagapag-alaga ng Kabundukan — malaking golem na bato na may core ng lava',
             'sprite_key': 'guardian_bulkan', 'sort_order': 2},
            {'name': 'haribon', 'display_name': 'Haribon', 'display_name_filipino': 'Haribon',
             'element': 'WIND', 'combat_role': 'SPEED', 'region_code': 'MIN_FOR',
             'awakening_chapter': 4, 'power_1': 'Wind Dash', 'power_2': 'Feather Storm',
             'power_3': 'Sky Strike', 'description': 'Wind Guardian — the Philippine Eagle spirit',
             'description_filipino': 'Tagapag-alaga ng Hangin — espiritu ng Agila ng Pilipinas',
             'sprite_key': 'guardian_haribon', 'sort_order': 3},
            {'name': 'pawikan', 'display_name': 'Pawikan', 'display_name_filipino': 'Pawikan',
             'element': 'MARINE', 'combat_role': 'SUPPORT', 'region_code': 'TUB',
             'awakening_chapter': 5, 'power_1': 'Coral Shield', 'power_2': 'Deep Current',
             'power_3': 'Bubble Trap', 'description': 'Marine Guardian — ancient sea turtle spirit',
             'description_filipino': 'Tagapag-alaga ng Karagatan — sinaunang espiritu ng pagong-dagat',
             'sprite_key': 'guardian_pawikan', 'sort_order': 4},
        ]
        for d in data:
            rc = d.pop('region_code')
            d['region'] = regions.get(rc)
            obj, created = Guardian.objects.update_or_create(name=d['name'], defaults=d)
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  🛡️ {len(data)} Guardians seeded!\n'))

    # ── GENERALS ──────────────────────────────────────
    def _seed_generals(self, regions):
        data = [
            {'name': 'usok', 'display_name': 'Usok', 'display_name_filipino': 'Usok',
             'threat_type': 'AIR', 'region_code': 'NCR', 'chapter_number': 1, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'NATURE',
             'description': 'The Smoke General — dark smoke monster born from industrial pollution',
             'description_filipino': 'Ang Heneral ng Usok — madilim na halimaw ng usok mula sa industriyal na polusyon',
             'sprite_key': 'general_usok', 'sort_order': 0},
            {'name': 'mantsa', 'display_name': 'Mantsa', 'display_name_filipino': 'Mantsa',
             'threat_type': 'WATER', 'region_code': 'MNL_BAY', 'chapter_number': 2, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'WATER',
             'description': 'The Stain General — toxic water creature corrupting Manila Bay',
             'description_filipino': 'Ang Heneral ng Mantsa — lason na nilalang ng tubig na sumisira sa Look ng Maynila',
             'sprite_key': 'general_mantsa', 'sort_order': 1},
            {'name': 'hukay', 'display_name': 'Hukay', 'display_name_filipino': 'Hukay',
             'threat_type': 'MINING', 'region_code': 'CAR', 'chapter_number': 3, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'EARTH',
             'description': 'The Pit General — underground mining destroyer ravaging Cordillera',
             'description_filipino': 'Ang Heneral ng Hukay — tagasira ng minahan sa ilalim ng lupa na sumisira sa Kordilyera',
             'sprite_key': 'general_hukay', 'sort_order': 2},
            {'name': 'putol', 'display_name': 'Putol', 'display_name_filipino': 'Putol',
             'threat_type': 'FOREST', 'region_code': 'MIN_FOR', 'chapter_number': 4, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'WIND',
             'description': 'The Chainsaw General — deforestation beast destroying Mindanao',
             'description_filipino': 'Ang Heneral ng Putol — halimaw ng pagputol ng puno na sumisira sa Mindanao',
             'sprite_key': 'general_putol', 'sort_order': 3},
            {'name': 'lason', 'display_name': 'Lason', 'display_name_filipino': 'Lason',
             'threat_type': 'OCEAN', 'region_code': 'TUB', 'chapter_number': 5, 'saga': 1,
             'battle_phases': 3, 'weakness_element': 'MARINE',
             'description': 'The Poison General — deep sea pollution creature in Tubbataha',
             'description_filipino': 'Ang Heneral ng Lason — nilalang ng polusyon sa kailaliman ng dagat sa Tubbataha',
             'sprite_key': 'general_lason', 'sort_order': 4},
            {'name': 'ang_dumi', 'display_name': 'Ang Dumi', 'display_name_filipino': 'Ang Dumi',
             'threat_type': 'FINAL', 'region_code': None, 'chapter_number': 6, 'saga': 1,
             'battle_phases': 5, 'weakness_element': '',
             'description': 'The Final Boss — the embodiment of all pollution and environmental destruction',
             'description_filipino': 'Ang Huling Boss — ang kabuuan ng lahat ng polusyon at pagkasira ng kalikasan',
             'sprite_key': 'general_ang_dumi', 'sort_order': 5},
        ]
        for d in data:
            rc = d.pop('region_code')
            d['region'] = regions.get(rc) if rc else None
            obj, created = General.objects.update_or_create(name=d['name'], defaults=d)
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  💀 {len(data)} Generals seeded!\n'))

    # ── ACHIEVEMENTS ──────────────────────────────────
    def _seed_achievements(self):
        data = [
            {'code': 'FIRST_STEP', 'name': 'Ang Unang Hakbang', 'name_filipino': 'Ang Unang Hakbang',
             'achievement_type': 'STORY', 'rarity': 'COMMON', 'points': 10,
             'description': 'Begin your journey as a Guardian of the Environment',
             'description_filipino': 'Simulan ang iyong paglalakbay bilang Tagapag-alaga ng Kalikasan'},
            {'code': 'FIRST_BLOOD', 'name': 'Unang Laban', 'name_filipino': 'Unang Laban',
             'achievement_type': 'COMBAT', 'rarity': 'COMMON', 'points': 10,
             'description': 'Win your first battle',
             'description_filipino': 'Manalo sa iyong unang laban'},
            {'code': 'TREE_HUGGER', 'name': 'Yumayakap sa Puno', 'name_filipino': 'Yumayakap sa Puno',
             'achievement_type': 'ENVIRONMENTAL', 'rarity': 'UNCOMMON', 'points': 25,
             'description': 'Plant 100 trees in-game',
             'description_filipino': 'Magtanim ng 100 puno sa laro'},
            {'code': 'GUARDIAN_AWAKENER', 'name': 'Tagapagpukaw', 'name_filipino': 'Tagapagpukaw',
             'achievement_type': 'STORY', 'rarity': 'RARE', 'points': 50,
             'description': 'Awaken your first Guardian',
             'description_filipino': 'Gisingin ang iyong unang Tagapag-alaga'},
            {'code': 'GENERAL_SLAYER', 'name': 'Manlulupig', 'name_filipino': 'Manlulupig',
             'achievement_type': 'COMBAT', 'rarity': 'RARE', 'points': 50,
             'description': 'Defeat your first General',
             'description_filipino': 'Talunin ang iyong unang Heneral'},
            {'code': 'ALL_GUARDIANS', 'name': 'Limang Elemento', 'name_filipino': 'Limang Elemento',
             'achievement_type': 'STORY', 'rarity': 'EPIC', 'points': 100,
             'description': 'Awaken all 5 Guardians',
             'description_filipino': 'Gisingin ang lahat ng 5 Tagapag-alaga'},
            {'code': 'EXPLORER', 'name': 'Manlalakbay', 'name_filipino': 'Manlalakbay',
             'achievement_type': 'EXPLORATION', 'rarity': 'UNCOMMON', 'points': 25,
             'description': 'Visit all 6 regions',
             'description_filipino': 'Bisitahin ang lahat ng 6 na rehiyon'},
            {'code': 'CODEX_SCHOLAR', 'name': 'Iskolar ng Codex', 'name_filipino': 'Iskolar ng Codex',
             'achievement_type': 'EXPLORATION', 'rarity': 'RARE', 'points': 50,
             'description': 'Unlock 20 Codex entries',
             'description_filipino': 'I-unlock ang 20 entry sa Codex'},
            {'code': 'ECO_WARRIOR', 'name': 'Mandirigma ng Kalikasan', 'name_filipino': 'Mandirigma ng Kalikasan',
             'achievement_type': 'ENVIRONMENTAL', 'rarity': 'EPIC', 'points': 100,
             'description': 'Restore all environment meters in one region to 100%',
             'description_filipino': 'Ibalik ang lahat ng metro ng kalikasan sa isang rehiyon sa 100%'},
            {'code': 'SAGA_COMPLETE', 'name': 'Ang Paggising', 'name_filipino': 'Ang Paggising',
             'achievement_type': 'STORY', 'rarity': 'LEGENDARY', 'points': 500,
             'description': 'Complete Saga I — The Awakening',
             'description_filipino': 'Tapusin ang Saga I — Ang Paggising'},
            {'code': 'BANTAY', 'name': 'Bantay ng Kalikasan', 'name_filipino': 'Bantay ng Kalikasan',
             'achievement_type': 'COMMUNITY', 'rarity': 'LEGENDARY', 'points': 1000,
             'description': 'Reach the highest Eco Rank', 'is_hidden': True,
             'description_filipino': 'Abutin ang pinakamataas na Eco Rank'},
        ]
        for d in data:
            is_hidden = d.pop('is_hidden', False)
            obj, created = Achievement.objects.update_or_create(
                code=d['code'], defaults={**d, 'is_hidden': is_hidden}
            )
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  🏆 {len(data)} Achievements seeded!\n'))

    # ── GAME MESSAGES ─────────────────────────────────
    def _seed_messages(self):
        data = [
            # Greetings
            {'key': 'welcome_greeting', 'message_type': 'GREETING', 'speaker': 'Luntian',
             'text_english': 'Welcome, Guardian. The land calls for your help.',
             'text_filipino': 'Maligayang pagdating, Tagapag-alaga. Tumatawag ang lupa para sa iyong tulong.',
             'sort_order': 0},
            {'key': 'return_greeting', 'message_type': 'GREETING', 'speaker': 'Luntian',
             'text_english': 'You have returned! The earth remembers your name.',
             'text_filipino': 'Bumalik ka na! Naalala ng lupa ang iyong pangalan.',
             'sort_order': 1},
            # Chapter 1 — Metro Manila
            {'key': 'ch1_intro', 'message_type': 'DIALOGUE', 'chapter': 1, 'speaker': 'Narrator',
             'text_english': 'Metro Manila chokes under a blanket of gray smoke. The air burns. The trees weep.',
             'text_filipino': 'Nasakal ang Kalakhang Maynila sa kumot ng abo. Nasusunog ang hangin. Umiiyak ang mga puno.',
             'sort_order': 0},
            {'key': 'ch1_usok_taunt', 'message_type': 'DIALOGUE', 'chapter': 1, 'speaker': 'Usok',
             'text_english': 'You think you can clear the skies? I AM the sky now!',
             'text_filipino': 'Akala mo ba malilinis mo ang langit? AKO na ang langit ngayon!',
             'sort_order': 1},
            {'key': 'ch1_victory', 'message_type': 'DIALOGUE', 'chapter': 1, 'speaker': 'Luntian',
             'text_english': 'The smoke clears... I can feel the sun again. Thank you, Guardian.',
             'text_filipino': 'Lumiwanag na ang usok... Nararamdaman ko na ang araw. Salamat, Tagapag-alaga.',
             'sort_order': 2},
            # Chapter 2 — Manila Bay
            {'key': 'ch2_intro', 'message_type': 'DIALOGUE', 'chapter': 2, 'speaker': 'Narrator',
             'text_english': 'The waters of Manila Bay run dark. Plastic chokes the fish. Alon stirs beneath the waves.',
             'text_filipino': 'Madilim ang tubig ng Look ng Maynila. Plastik ang bumabara sa isda. Gumagalaw si Alon sa ilalim ng alon.',
             'sort_order': 0},
            {'key': 'ch2_alon_awaken', 'message_type': 'DIALOGUE', 'chapter': 2, 'speaker': 'Alon',
             'text_english': 'The ocean weeps, Guardian. Will you help me cleanse these waters?',
             'text_filipino': 'Umiiyak ang karagatan, Tagapag-alaga. Tutulungan mo ba akong linisin ang mga tubig na ito?',
             'sort_order': 1},
            # Chapter 3 — Cordillera
            {'key': 'ch3_intro', 'message_type': 'DIALOGUE', 'chapter': 3, 'speaker': 'Narrator',
             'text_english': 'The ancient rice terraces crumble as mining scars the mountains. Bulkan rumbles in anger.',
             'text_filipino': 'Gumuguho ang sinaunang rice terraces habang sinisira ng pagmimina ang kabundukan. Kumukulo si Bulkan sa galit.',
             'sort_order': 0},
            # Chapter 4 — Mindanao Forest
            {'key': 'ch4_intro', 'message_type': 'DIALOGUE', 'chapter': 4, 'speaker': 'Narrator',
             'text_english': 'The chainsaws echo through the forest. The Philippine Eagle searches for a home that no longer exists.',
             'text_filipino': 'Umalingawngaw ang mga chainsaw sa kagubatan. Naghahanap ang Agila ng Pilipinas ng tahanang wala na.',
             'sort_order': 0},
            {'key': 'ch4_haribon_cry', 'message_type': 'DIALOGUE', 'chapter': 4, 'speaker': 'Haribon',
             'text_english': 'My wings carry the last breath of the forest. Fight with me!',
             'text_filipino': 'Dala ng aking mga pakpak ang huling hininga ng kagubatan. Lumaban ka kasama ko!',
             'sort_order': 1},
            # Chapter 5 — Tubbataha
            {'key': 'ch5_intro', 'message_type': 'DIALOGUE', 'chapter': 5, 'speaker': 'Narrator',
             'text_english': 'Beneath the waves, the coral bleaches white. Plastic drifts like ghosts. Pawikan swims through the poison.',
             'text_filipino': 'Sa ilalim ng alon, pumuputi ang korales. Lumutang-lutang ang plastik tulad ng mga multo. Lumalangoy si Pawikan sa lason.',
             'sort_order': 0},
            # Battle messages
            {'key': 'first_battle', 'message_type': 'BATTLE', 'speaker': 'Luntian',
             'text_english': 'Stand firm! The Dumi creatures are coming!',
             'text_filipino': 'Tumayo nang matatag! Paparating na ang mga nilalang ng Dumi!',
             'sort_order': 0},
            {'key': 'battle_victory', 'message_type': 'BATTLE', 'speaker': 'System',
             'text_english': '⚔️ Victory! The environment heals a little more.',
             'text_filipino': '⚔️ Tagumpay! Gumagaling nang kaunti ang kalikasan.',
             'sort_order': 1},
            {'key': 'battle_defeat', 'message_type': 'BATTLE', 'speaker': 'Luntian',
             'text_english': 'We fell... but the earth still believes in us. Try again, Guardian.',
             'text_filipino': 'Natalo tayo... pero naniniwala pa rin ang lupa sa atin. Subukan muli, Tagapag-alaga.',
             'sort_order': 2},
            # Notifications
            {'key': 'tree_planted', 'message_type': 'NOTIFICATION', 'speaker': 'System',
             'text_english': '🌳 A tree has been planted! The earth remembers.',
             'text_filipino': '🌳 May punong naitanim! Naalala ng lupa.',
             'sort_order': 0},
            {'key': 'guardian_awakened', 'message_type': 'NOTIFICATION', 'speaker': 'System',
             'text_english': '🛡️ A Guardian has been awakened! Their power flows through you.',
             'text_filipino': '🛡️ Nagising ang isang Tagapag-alaga! Dumadaloy ang kanilang kapangyarihan sa iyo.',
             'sort_order': 1},
            {'key': 'achievement_unlocked', 'message_type': 'ACHIEVEMENT', 'speaker': 'System',
             'text_english': '🏆 Achievement Unlocked!',
             'text_filipino': '🏆 Na-unlock ang Tagumpay!',
             'sort_order': 0},
            # Tutorials
            {'key': 'tutorial_movement', 'message_type': 'TUTORIAL', 'speaker': 'Luntian',
             'text_english': 'Use WASD or Arrow Keys to move. Explore the world around you!',
             'text_filipino': 'Gamitin ang WASD o Arrow Keys para gumalaw. Tuklasin ang mundo sa paligid mo!',
             'sort_order': 0},
            {'key': 'tutorial_battle', 'message_type': 'TUTORIAL', 'speaker': 'Luntian',
             'text_english': 'Click on enemies to attack. Switch Guardians to exploit elemental weaknesses!',
             'text_filipino': 'I-click ang mga kalaban para atakihin. Magpalit ng Guardian para samantalahin ang kahinaan ng elemento!',
             'sort_order': 1},
        ]
        for d in data:
            obj, created = GameMessage.objects.update_or_create(key=d['key'], defaults=d)
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  💬 {len(data)} Messages seeded!\n'))

    # ── CODEX (Environmental Data) ────────────────────
    def _seed_codex(self, regions):
        data = [
            # ── Philippine Laws ──
            {'title': 'RA 8749 — Philippine Clean Air Act of 1999',
             'title_filipino': 'RA 8749 — Batas sa Malinis na Hangin ng Pilipinas ng 1999',
             'category': 'LAW', 'impact_level': 'HIGH',
             'content': 'Establishes a comprehensive air quality management policy and program. It aims to achieve and maintain healthy air quality for all Filipinos. Penalties include fines up to ₱100,000/day and imprisonment.',
             'content_filipino': 'Nagtatatag ng komprehensibong polisiya at programa sa pamamahala ng kalidad ng hangin. Layunin nitong makamit at mapanatili ang malusog na kalidad ng hangin para sa lahat ng Pilipino. Ang parusa ay multang hanggang ₱100,000/araw at pagkakakulong.',
             'source': 'Official Gazette of the Philippines',
             'related_chapter': 1, 'region_code': 'NCR'},
            {'title': 'RA 9003 — Ecological Solid Waste Management Act of 2000',
             'title_filipino': 'RA 9003 — Batas sa Ekolohikal na Pamamahala ng Solidong Basura ng 2000',
             'category': 'LAW', 'impact_level': 'HIGH',
             'content': 'Provides a systematic, comprehensive, and ecological waste management program. Mandates segregation at source, recycling, and composting. Prohibits open dumpsites and requires sanitary landfills.',
             'content_filipino': 'Nagbibigay ng sistematiko, komprehensibo, at ekolohikal na programa sa pamamahala ng basura. Inaatas ang segregasyon sa pinagmulan, pag-recycle, at composting. Ipinagbabawal ang open dumpsites.',
             'source': 'DENR-EMB', 'related_chapter': 1, 'region_code': 'NCR'},
            {'title': 'RA 9275 — Philippine Clean Water Act of 2004',
             'title_filipino': 'RA 9275 — Batas sa Malinis na Tubig ng Pilipinas ng 2004',
             'category': 'LAW', 'impact_level': 'HIGH',
             'content': 'Aims to protect the country\'s water bodies from pollution. Requires all establishments to treat wastewater before discharge. Violators face fines of ₱10,000-₱200,000/day.',
             'content_filipino': 'Layunin nitong protektahan ang mga katawan ng tubig mula sa polusyon. Inaatas sa lahat ng establisyimento na i-treat ang wastewater bago i-discharge. Ang mga lumalabag ay nagbabayad ng multa na ₱10,000-₱200,000/araw.',
             'source': 'DENR-EMB', 'related_chapter': 2, 'region_code': 'MNL_BAY'},
            {'title': 'RA 7942 — Philippine Mining Act of 1995',
             'title_filipino': 'RA 7942 — Batas sa Pagmimina ng Pilipinas ng 1995',
             'category': 'LAW', 'impact_level': 'CRITICAL',
             'content': 'Governs the exploration, development, and utilization of mineral resources. Controversial for allowing large-scale mining that has caused environmental damage in Cordillera and Mindanao. Requires Environmental Impact Assessment (EIA).',
             'content_filipino': 'Pinapamahalaan ang pagtuklas, pagpapaunlad, at paggamit ng mineral na yaman. Kontrobersiyal sa pagpapahintulot ng malakihang pagmimina na nagdulot ng pinsala sa kalikasan sa Kordilyera at Mindanao.',
             'source': 'DENR-MGB', 'related_chapter': 3, 'region_code': 'CAR'},
            {'title': 'RA 9147 — Wildlife Resources Conservation and Protection Act',
             'title_filipino': 'RA 9147 — Batas sa Konserbasyon at Proteksyon ng mga Yamang Hayop',
             'category': 'LAW', 'impact_level': 'HIGH',
             'content': 'Provides for the conservation and protection of wildlife species and their habitats. Prohibits collection, hunting, or possession of endangered species. Penalties include up to 12 years imprisonment.',
             'content_filipino': 'Nagbibigay ng konserbasyon at proteksyon ng mga species ng hayop at kanilang tirahan. Ipinagbabawal ang pangongolekta, pangangaso, o pagkakaroon ng nanganganib na species.',
             'source': 'DENR-BMB', 'related_chapter': 4, 'region_code': 'MIN_FOR'},
            {'title': 'RA 11038 — Expanded National Integrated Protected Areas System (ENIPAS)',
             'title_filipino': 'RA 11038 — Pinalawak na Pambansang Pinagsamang Sistema ng Protektadong Lugar',
             'category': 'LAW', 'impact_level': 'HIGH',
             'content': 'Declares 94 additional protected areas in the Philippines, including Tubbataha Reefs Natural Park. Strengthens protection of critical habitats, watersheds, and marine ecosystems.',
             'content_filipino': 'Nagdedeklara ng 94 karagdagang protektadong lugar sa Pilipinas, kabilang ang Tubbataha Reefs Natural Park. Pinapalakas ang proteksyon ng mga kritikal na tirahan.',
             'source': 'DENR-BMB', 'related_chapter': 5, 'region_code': 'TUB'},

            # ── Endangered Species ──
            {'title': 'Philippine Eagle (Pithecophaga jefferyi)',
             'title_filipino': 'Agila ng Pilipinas (Pithecophaga jefferyi)',
             'category': 'SPECIES', 'impact_level': 'CRITICAL',
             'content': 'The national bird of the Philippines and one of the world\'s largest and most powerful eagles. Critically endangered with only 400-800 individuals remaining in the wild. Primary threats: deforestation and hunting.',
             'content_filipino': 'Ang pambansang ibon ng Pilipinas at isa sa pinakamalaki at pinakamakapangyarihang agila sa mundo. Kritikal na nanganganib na may 400-800 na lang na indibidwal sa ligaw. Pangunahing banta: pagputol ng puno at pangangaso.',
             'source': 'Philippine Eagle Foundation', 'related_chapter': 4, 'region_code': 'MIN_FOR'},
            {'title': 'Tamaraw (Bubalus mindorensis)',
             'title_filipino': 'Tamaraw (Bubalus mindorensis)',
             'category': 'SPECIES', 'impact_level': 'CRITICAL',
             'content': 'A small, hoofed buffalo found only in Mindoro, Philippines. Critically endangered with fewer than 600 remaining. The Tamaraw is one of the rarest large mammals on Earth.',
             'content_filipino': 'Isang maliit na kalabaw na makikita lamang sa Mindoro, Pilipinas. Kritikal na nanganganib na may mas mababa sa 600 na lang na natitira. Isa sa pinakabihirang malalaking mamal sa mundo.',
             'source': 'DENR-BMB', 'related_chapter': None, 'region_code': None},
            {'title': 'Hawksbill Sea Turtle (Eretmochelys imbricata)',
             'title_filipino': 'Pawikan — Hawksbill (Eretmochelys imbricata)',
             'category': 'SPECIES', 'impact_level': 'CRITICAL',
             'content': 'Found in Tubbataha and Philippine waters. Critically endangered due to poaching for their beautiful shells, habitat loss, and ocean pollution. Protected under RA 9147.',
             'content_filipino': 'Matatagpuan sa Tubbataha at karagatan ng Pilipinas. Kritikal na nanganganib dahil sa pangangaso para sa magandang balat, pagkawala ng tirahan, at polusyon sa karagatan.',
             'source': 'Marine Wildlife Watch PH', 'related_chapter': 5, 'region_code': 'TUB'},
            {'title': 'Philippine Tarsier (Carlito syrichta)',
             'title_filipino': 'Tarsier ng Pilipinas (Carlito syrichta)',
             'category': 'SPECIES', 'impact_level': 'HIGH',
             'content': 'One of the smallest primates in the world, found in Bohol, Samar, Leyte, and Mindanao. Near Threatened due to habitat destruction and illegal pet trade. Extremely sensitive to stress — captivity can kill them.',
             'content_filipino': 'Isa sa pinakamaliit na primate sa mundo, matatagpuan sa Bohol, Samar, Leyte, at Mindanao. Malapit na sa Banta dahil sa pagkasira ng tirahan at iligal na pet trade.',
             'source': 'Philippine Tarsier Foundation', 'related_chapter': None, 'region_code': None},

            # ── Pollution Facts ──
            {'title': 'Philippines: 3rd Largest Ocean Plastic Polluter',
             'title_filipino': 'Pilipinas: Pangatlo sa Pinakamaraming Plastik na Polusyon sa Karagatan',
             'category': 'POLLUTION', 'impact_level': 'CRITICAL',
             'content': 'The Philippines generates approximately 2.7 million metric tons of plastic waste annually. About 20% (540,000 tons) ends up in the ocean. The Pasig River alone contributes approximately 63,700 tons per year.',
             'content_filipino': 'Ang Pilipinas ay nagpo-produce ng humigit-kumulang 2.7 milyong metric tons ng plastic waste taun-taon. Mga 20% (540,000 tons) ang napupunta sa karagatan.',
             'source': 'Ocean Conservancy / World Bank', 'related_chapter': 2, 'region_code': 'MNL_BAY'},
            {'title': 'Metro Manila Air Quality Crisis',
             'title_filipino': 'Krisis sa Kalidad ng Hangin sa Kalakhang Maynila',
             'category': 'POLLUTION', 'impact_level': 'HIGH',
             'content': 'Metro Manila regularly exceeds WHO safe limits for PM2.5 particulate matter. Vehicular emissions account for 80% of air pollution in the capital. An estimated 27,000 Filipinos die annually from air pollution-related illnesses.',
             'content_filipino': 'Regular na lumalampas ang Kalakhang Maynila sa ligtas na limitasyon ng WHO para sa PM2.5. Ang emisyon ng mga sasakyan ang bumubuo ng 80% ng polusyon sa hangin sa kabisera.',
             'source': 'DENR-EMB / WHO', 'related_chapter': 1, 'region_code': 'NCR'},
            {'title': 'Illegal Mining in Cordillera',
             'title_filipino': 'Iligal na Pagmimina sa Kordilyera',
             'category': 'POLLUTION', 'impact_level': 'CRITICAL',
             'content': 'Small-scale mining in Benguet and surrounding provinces releases mercury and cyanide into waterways. The Baguio-Benguet mining district has been active since the 1900s, leaving behind tailings dams and contaminated soil.',
             'content_filipino': 'Ang small-scale mining sa Benguet at mga karatig na lalawigan ay nagpapalabas ng mercury at cyanide sa mga daluyan ng tubig.',
             'source': 'DENR-MGB / Cordillera Studies Center', 'related_chapter': 3, 'region_code': 'CAR'},

            # ── Climate Data ──
            {'title': 'Philippines: 4th Most Climate-Vulnerable Country',
             'title_filipino': 'Pilipinas: Pang-apat na Pinaka-Vulnerable sa Klima',
             'category': 'CLIMATE', 'impact_level': 'CRITICAL',
             'content': 'The Philippines is ranked 4th most vulnerable to climate change impacts by the Global Climate Risk Index. The country experiences an average of 20 typhoons annually, with increasing intensity linked to climate change.',
             'content_filipino': 'Ang Pilipinas ay naka-ranggo sa pang-apat na pinaka-vulnerable sa epekto ng climate change ayon sa Global Climate Risk Index. Nakakaranas ang bansa ng average na 20 bagyo taun-taon.',
             'source': 'Germanwatch Global Climate Risk Index', 'related_chapter': None, 'region_code': None},
            {'title': 'Sea Level Rise Threat to Philippine Coastlines',
             'title_filipino': 'Banta ng Pagtaas ng Dagat sa mga Baybayin ng Pilipinas',
             'category': 'CLIMATE', 'impact_level': 'HIGH',
             'content': 'Sea levels around the Philippines are rising at twice the global average — about 5.7mm per year. By 2100, major coastal cities like Manila could face 1-meter sea level rise, displacing millions.',
             'content_filipino': 'Ang lebel ng dagat sa paligid ng Pilipinas ay tumataas nang doble sa global average — mga 5.7mm bawat taon. Bago mag-2100, maaaring harapin ng Manila ang 1-metro na pagtaas ng dagat.',
             'source': 'PAGASA / IPCC', 'related_chapter': 2, 'region_code': 'MNL_BAY'},

            # ── Conservation ──
            {'title': 'Tubbataha Reefs Natural Park — UNESCO World Heritage Site',
             'title_filipino': 'Tubbataha Reefs Natural Park — UNESCO World Heritage Site',
             'category': 'CONSERVATION', 'impact_level': 'MEDIUM',
             'content': 'A 97,030-hectare marine protected area in the Sulu Sea. Home to 600 fish species, 360 coral species, 11 shark species, 13 dolphin/whale species, and nesting Hawksbill and Green sea turtles. Declared a UNESCO World Heritage Site in 1993.',
             'content_filipino': 'Isang 97,030-ektaryang protektadong lugar sa dagat sa Dagat Sulu. Tahanan ng 600 species ng isda, 360 species ng korales, 11 species ng pating, at mga nesting Pawikan.',
             'source': 'Tubbataha Management Office / UNESCO', 'related_chapter': 5, 'region_code': 'TUB'},
            {'title': 'Ifugao Rice Terraces — Living Cultural Landscape',
             'title_filipino': 'Rice Terraces ng Ifugao — Buhay na Cultural Landscape',
             'category': 'CONSERVATION', 'impact_level': 'MEDIUM',
             'content': 'The 2,000-year-old rice terraces carved into the mountains of Ifugao are a UNESCO World Heritage Site. They represent the harmony between humans and the environment. Threatened by modernization, climate change, and the giant earthworm invasion.',
             'content_filipino': 'Ang 2,000 taong gulang na rice terraces na inukit sa kabundukan ng Ifugao ay isang UNESCO World Heritage Site. Kinakatawan nito ang pagkakaisa ng tao at kalikasan.',
             'source': 'UNESCO / National Commission for Culture and the Arts', 'related_chapter': 3, 'region_code': 'CAR'},
            {'title': 'Mt. Apo Natural Park — Highest Peak Conservation',
             'title_filipino': 'Mt. Apo Natural Park — Konserbasyon ng Pinakamataas na Bundok',
             'category': 'CONSERVATION', 'impact_level': 'MEDIUM',
             'content': 'Mt. Apo (2,954m) is the highest peak in the Philippines and a key biodiversity area. The national park protects the habitat of the Philippine Eagle, Waling-waling orchid, and endemic species. Threatened by geothermal energy extraction and illegal logging.',
             'content_filipino': 'Ang Mt. Apo (2,954m) ay ang pinakamataas na bundok sa Pilipinas at isang key biodiversity area. Pinoprotektahan ng national park ang tirahan ng Agila ng Pilipinas at mga endemic species.',
             'source': 'DENR Region XI', 'related_chapter': 4, 'region_code': 'MIN_FOR'},

            # ── History ──
            {'title': 'The Tragedy of Marcopper Mining (1996)',
             'title_filipino': 'Ang Trahedya ng Marcopper Mining (1996)',
             'category': 'HISTORY', 'impact_level': 'CRITICAL',
             'content': 'In 1996, the Marcopper Mining disaster in Marinduque released 1.6 million cubic meters of toxic mine tailings into the Boac River, killing the river and affecting 20,000 residents. It remains one of the worst mining disasters in Philippine history.',
             'content_filipino': 'Noong 1996, ang Marcopper Mining disaster sa Marinduque ay nagpalabas ng 1.6 milyong cubic meters ng toxic mine tailings sa Ilog Boac, pinatay ang ilog at naapektuhan ang 20,000 residente.',
             'source': 'DENR / Supreme Court GR No. 195580', 'related_chapter': 3, 'region_code': 'CAR'},
            {'title': 'Payatas Dumpsite Tragedy (2000)',
             'title_filipino': 'Trahedya ng Payatas Dumpsite (2000)',
             'category': 'HISTORY', 'impact_level': 'CRITICAL',
             'content': 'On July 10, 2000, a massive trash slide at the Payatas dumpsite in Quezon City buried over 300 people alive. The tragedy led to the passage of RA 9003 (Ecological Solid Waste Management Act). A reminder that waste management is a life-or-death issue.',
             'content_filipino': 'Noong Hulyo 10, 2000, isang malaking pagguho ng basura sa Payatas dumpsite sa Quezon City ang bumaon sa mahigit 300 tao. Ang trahedya ang nagdulot ng pagpasa ng RA 9003.',
             'source': 'Philippine Daily Inquirer / RA 9003', 'related_chapter': 1, 'region_code': 'NCR'},
        ]
        for d in data:
            rc = d.pop('region_code', None)
            d['related_region'] = regions.get(rc) if rc else None
            obj, created = EnvironmentalData.objects.update_or_create(
                title=d['title'], defaults=d
            )
            self.stdout.write(f"  {'✅ Created' if created else '🔄 Updated'}: {obj}")
        self.stdout.write(self.style.SUCCESS(f'\n  📚 {len(data)} Codex entries seeded!\n'))