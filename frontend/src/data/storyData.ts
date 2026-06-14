/**
 * 📖 LUNTIAN ANGLARO — Story Data Store
 * Complete narrative data for both Sagas based on the Story Bible.
 * This is the SPINE that connects all game systems:
 * Regions, Guardians, Generals, Battles, Achievements, Codex
 */

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

export interface StoryDialogue {
  speaker: 'narrator' | 'luntian' | 'player' | 'guardian' | 'general' | 'npc'
  speakerName?: string
  text_en: string
  text_fil: string
  emotion?: 'neutral' | 'sad' | 'angry' | 'hopeful' | 'terrified' | 'determined' | 'whisper'
}

export interface StoryScene {
  id: string
  type: 'dialogue' | 'narration' | 'choice' | 'battle' | 'awakening' | 'cutscene' | 'exploration'
  dialogues: StoryDialogue[]
  // For 'choice' type
  choices?: {
    text_en: string
    text_fil: string
    nextScene: string
    governanceEffect?: number // Saga II: +/- governance meter
  }[]
  // For 'battle' type
  battleConfig?: {
    guardian: string
    general: string
    isBossFight: boolean
  }
  // For 'awakening' type
  awakenGuardian?: string
  // Next scene (linear progression)
  nextScene?: string
}

export interface StoryChapter {
  id: string
  saga: 1 | 2
  chapterNumber: number
  title_en: string
  title_fil: string
  subtitle_en: string
  subtitle_fil: string
  region: string
  theme_en: string
  theme_fil: string
  enemy?: string
  guardian?: string
  isLocked: boolean
  scenes: StoryScene[]
  // What completing this chapter unlocks
  unlocks: {
    regions?: string[]
    guardians?: string[]
    generals?: string[]
    codexEntries?: string[]
    achievements?: string[]
  }
  // Opening quote
  quote_en?: string
  quote_fil?: string
  // Chapter summary for the selector
  summary_en: string
  summary_fil: string
}

export interface Saga {
  id: number
  title_en: string
  title_fil: string
  subtitle_en: string
  subtitle_fil: string
  chapters: StoryChapter[]
}

/* ═══════════════════════════════════════════════
   SAGA I: ANG PAGGISING (The Awakening)
   ═══════════════════════════════════════════════ */

const SAGA_I_CHAPTERS: StoryChapter[] = [
  /* ── PROLOGUE: Ang Unang Dikit ── */
  {
    id: 'prologue',
    saga: 1,
    chapterNumber: 0,
    title_en: 'The First Touch',
    title_fil: 'Ang Unang Dikit',
    subtitle_en: 'Where it all begins',
    subtitle_fil: 'Kung saan nagsisimula ang lahat',
    region: 'punong_bayan',
    theme_en: 'Awakening',
    theme_fil: 'Paggising',
    isLocked: false, // Always unlocked — starting chapter
    summary_en: 'An ordinary evening. A tired student. A dying park in Quezon City. A faint green glow among the roots of an old tree. The moment of contact that changes everything.',
    summary_fil: 'Isang ordinaryong gabi. Isang pagod na estudyante. Isang namamatay na parke sa Quezon City. Isang mahinang berdeng liwanag sa mga ugat ng isang lumang puno. Ang sandaling nagbago sa lahat.',
    quote_en: 'Before the islands even had names, the wind already had voices.',
    quote_fil: 'Bago pa man nagkaroon ng pangalan ang mga isla, may mga tinig na ang hangin.',
    unlocks: {
      regions: ['punong_bayan'],
      guardians: ['luntian'],
      codexEntries: ['luntian_lore', 'bantay_ng_kalikasan'],
      achievements: ['first_touch'],
    },
    scenes: [
      {
        id: 'prologue_01',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Long before the first humans set foot on what would become the Philippines, the archipelago was alive — not merely with plants and creatures, but with consciousness. The islands breathed. The mountains dreamed. The oceans remembered.',
            text_fil: 'Matagal bago tumuntong ang unang tao sa magiging Pilipinas, buhay na ang kapuluan — hindi lang sa mga halaman at nilalang, kundi may kamalayan. Humihinga ang mga isla. Nananaginip ang mga bundok. Naaalala ng mga karagatan.',
          },
          {
            speaker: 'narrator',
            text_en: 'Bathala, the Supreme Creator, had woven a great tapestry of life across seven thousand islands, and to protect that tapestry, he gave it guardians. They were called Mga Bantay ng Kalikasan.',
            text_fil: 'Si Bathala, ang Kataas-taasang Lumikha, ay humabi ng isang dakilang tapiserya ng buhay sa pitong libong isla, at upang protektahan ang tapiseryang iyon, binigyan niya ito ng mga tagapag-alaga. Tinawag silang Mga Bantay ng Kalikasan.',
          },
        ],
        nextScene: 'prologue_02',
      },
      {
        id: 'prologue_02',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'For millennia, the balance held. But the world changed. Steel replaced bamboo. Concrete swallowed soil. Smoke rose where birds once flew. One by one, the Bantay grew weaker. Their voices faded. Their light dimmed. They fell into a deep, dreamless slumber.',
            text_fil: 'Sa loob ng libu-libong taon, nanatili ang balanse. Ngunit nagbago ang mundo. Pinalitan ng bakal ang kawayan. Nilamon ng semento ang lupa. Umusbong ang usok kung saan dating lumilipad ang mga ibon. Isa-isa, humina ang mga Bantay.',
          },
          {
            speaker: 'narrator',
            text_en: 'All except one. A tiny leaf spirit — barely the size of a child\'s palm, glowing faint green like the last ember of a dying fire — clung to life in a forgotten corner of a decaying urban park.',
            text_fil: 'Maliban sa isa. Isang maliit na espiritu ng dahon — halos kasing laki ng palad ng bata, kumikinang na mahinang berde tulad ng huling baga ng namamatay na apoy — kumapit sa buhay sa nakalimutang sulok ng isang nasisira na parke.',
          },
        ],
        nextScene: 'prologue_03',
      },
      {
        id: 'prologue_03',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'And then, on an ordinary evening in Quezon City, a tired, overworked Filipino student walked through that dying park, felt a strange warmth in the air, and reached out to touch a fading glow among the roots of an old acacia tree.',
            text_fil: 'At pagkatapos, isang ordinaryong gabi sa Quezon City, isang pagod at sobrang pinagtrabahuhang Pilipinong estudyante ang naglakad sa namamatay na parke, naramdaman ang kakaibang init sa hangin, at inabot ang isang kumukupas na liwanag sa mga ugat ng isang lumang akasya.',
          },
          {
            speaker: 'narrator',
            text_en: 'The moment their fingers touched, the world cracked open.',
            text_fil: 'Nang magdikit ang kanilang mga daliri, bumuka ang mundo.',
            emotion: 'determined',
          },
        ],
        nextScene: 'prologue_04',
      },
      {
        id: 'prologue_04',
        type: 'awakening',
        awakenGuardian: 'luntian',
        dialogues: [
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'I have been waiting for you for so long.',
            text_fil: 'Matagal na kitang hinihintay.',
            emotion: 'whisper',
          },
          {
            speaker: 'narrator',
            text_en: 'The spirit is small — barely visible, a green so faint it could be mistaken for moonlight filtering through leaves that are no longer there. But it is alive. And it remembers.',
            text_fil: 'Maliit ang espiritu — halos hindi makita, isang berdeng sobrang hina na maaaring mapagkamalan na liwanag ng buwan na dumadaan sa mga dahon na wala na. Ngunit buhay ito. At naaalala nito.',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'The land is dying. The Guardians sleep. The Corruption — Ang Dumi — grows stronger with each passing day. I am the last. And I am almost gone.',
            text_fil: 'Namamatay ang lupa. Natutulog ang mga Tagapag-alaga. Ang Kabulukan — Ang Dumi — lumalaki sa bawat araw na lumilipas. Ako ang huli. At halos wala na ako.',
            emotion: 'sad',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'But you are here now. And as long as even one life still cares... we will not die.',
            text_fil: 'Ngunit nandito ka na. At habang may kahit isang buhay na nagmamalasakit... hindi kami mamamatay.',
            emotion: 'hopeful',
          },
        ],
        nextScene: 'prologue_05',
      },
      {
        id: 'prologue_05',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'You see it now — the true state of the land. The invisible tendrils of pollution. The slow death of every living thing. Five dark pillars rising like black towers over the horizon. The Generals of Dumi.',
            text_fil: 'Nakikita mo na ngayon — ang tunay na kalagayan ng lupa. Ang mga hindi nakikitang ugat ng polusyon. Ang dahan-dahang kamatayan ng bawat buhay. Limang madilim na haligi na tumataas tulad ng itim na tore sa abot-tanaw.',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'Will you help me? Will you help us save what remains?',
            text_fil: 'Tutulungan mo ba ako? Tutulungan mo ba kaming iligtas ang natitira?',
            emotion: 'hopeful',
          },
        ],
        nextScene: undefined, // End of prologue
      },
    ],
  },

  /* ── CHAPTER 1: Hangin ng Lungkot ── */
  {
    id: 'chapter_1',
    saga: 1,
    chapterNumber: 1,
    title_en: 'Air of Sorrow',
    title_fil: 'Hangin ng Lungkot',
    subtitle_en: 'The battle for Manila\'s skies',
    subtitle_fil: 'Ang laban para sa langit ng Maynila',
    region: 'metro_manila',
    theme_en: 'Air Pollution',
    theme_fil: 'Polusyon sa Hangin',
    enemy: 'usok',
    isLocked: true,
    summary_en: 'The student\'s first mission takes them across a gray, suffocating Metro Manila. The air is poison, but no one seems to notice. The quest to find and defeat Usok leads through choked streets, past sick children and overwhelmed hospitals.',
    summary_fil: 'Ang unang misyon ng estudyante ay nagdadala sa kanila sa kulay abong, nakakabigat na Metro Manila. Lason ang hangin, ngunit walang pumapansin. Ang paghahanap at pagtalo kay Usok ay dumadaan sa mga siksik na kalye.',
    quote_en: 'You cannot see me, but I am in every breath you take.',
    quote_fil: 'Hindi mo ako nakikita, pero nasa bawat hininga mo ako.',
    unlocks: {
      regions: ['metro_manila'],
      generals: ['usok'],
      codexEntries: ['usok_lore', 'air_pollution'],
      achievements: ['clear_skies'],
    },
    scenes: [
      {
        id: 'ch1_01',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Metro Manila. The sprawling capital, home to millions. The sky should be blue, but it hasn\'t been blue in years. A permanent gray haze hangs over the city like a suffocating blanket.',
            text_fil: 'Metro Manila. Ang malawak na kabisera, tahanan ng milyon-milyon. Dapat asul ang langit, ngunit hindi na ito naging asul sa loob ng maraming taon. Isang permanenteng kulay abong hamog ang nakabalot sa lungsod.',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'Can you feel it? The heaviness in the air? That is Usok — the Smoke General. He has claimed the skies of Manila as his domain.',
            text_fil: 'Nararamdaman mo ba? Ang bigat ng hangin? Iyon si Usok — ang Heneral ng Usok. Inangkin niya ang langit ng Maynila bilang kanyang teritoryo.',
            emotion: 'determined',
          },
        ],
        nextScene: 'ch1_02',
      },
      {
        id: 'ch1_02',
        type: 'exploration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'You walk through choked streets. Past factories belching smoke. Past children coughing in school yards. Past hospitals overflowing with respiratory patients. No one looks up at the sky anymore. They\'ve forgotten what blue looks like.',
            text_fil: 'Naglakad ka sa mga siksik na kalye. Dumadaan sa mga pabrikang naglalabas ng usok. Dumadaan sa mga batang umuubo sa patyo ng paaralan. Dumadaan sa mga ospital na puno ng mga pasyente sa baga. Walang tumitingin sa langit. Nakalimutan na nila kung ano ang hitsura ng asul.',
          },
        ],
        nextScene: 'ch1_03',
      },
      {
        id: 'ch1_03',
        type: 'dialogue',
        dialogues: [
          {
            speaker: 'general',
            speakerName: 'Usok',
            text_en: 'You cannot see me, but I am in every breath you take.',
            text_fil: 'Hindi mo ako nakikita, pero nasa bawat hininga mo ako.',
            emotion: 'whisper',
          },
          {
            speaker: 'general',
            speakerName: 'Usok',
            text_en: 'I did not choose to exist. Your factories gave me life. Your vehicles feed me. Your burning garbage makes me stronger. You created me. And now... you cannot uncreate me.',
            text_fil: 'Hindi ko piniling umiral. Ang mga pabrika niyo ang nagbigay sa akin ng buhay. Ang mga sasakyan niyo ang nagpapakain sa akin. Ang mga sinusunog niyong basura ang nagpapalakas sa akin.',
            emotion: 'angry',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'Don\'t listen to him. He wants you to believe it\'s hopeless. But every breath of clean air is a victory. Fight him!',
            text_fil: 'Huwag kang makinig sa kanya. Gusto niyang maniwala ka na walang pag-asa. Ngunit bawat hininga ng malinis na hangin ay isang tagumpay. Labanan mo siya!',
            emotion: 'determined',
          },
        ],
        nextScene: 'ch1_battle',
      },
      {
        id: 'ch1_battle',
        type: 'battle',
        battleConfig: {
          guardian: 'luntian',
          general: 'usok',
          isBossFight: true,
        },
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'The smoke thickens. Usok takes form — a towering figure of industrial smoke, gray-black and shifting. The first battle begins.',
            text_fil: 'Kumapal ang usok. Nagkaroon ng anyo si Usok — isang napakalaking pigura ng industriyal na usok, kulay abo-itim at nagbabago-bago. Nagsimula ang unang laban.',
          },
        ],
        nextScene: 'ch1_victory',
      },
      {
        id: 'ch1_victory',
        type: 'cutscene',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Usok falls. For the first time in years, the sky over Manila clears. People look up, stunned, as if seeing the sun for the first time. Children point at the blue sky and laugh. Some adults weep.',
            text_fil: 'Bumagsak si Usok. Sa unang pagkakataon sa loob ng maraming taon, luminaw ang langit sa ibabaw ng Maynila. Tumingala ang mga tao, nagulat, na parang unang pagkakataong nakita ang araw. Tinuro ng mga bata ang asul na langit at tumawa. May mga matatanda na umiyak.',
          },
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'You did it. The sky breathes again. But this is only the beginning. Four more Guardians sleep. Four more Generals hold dominion. And Ang Dumi... grows stronger.',
            text_fil: 'Nagawa mo. Humihinga muli ang langit. Ngunit simula pa lamang ito. Apat pang Tagapag-alaga ang natutulog. Apat pang Heneral ang may dominyon. At si Ang Dumi... lumalakas.',
            emotion: 'hopeful',
          },
        ],
        nextScene: undefined,
      },
    ],
  },

  /* ── CHAPTER 2: Luha ng Dagat ── */
  {
    id: 'chapter_2',
    saga: 1,
    chapterNumber: 2,
    title_en: 'Tears of the Sea',
    title_fil: 'Luha ng Dagat',
    subtitle_en: 'Dive into the dying bay',
    subtitle_fil: 'Sumisid sa namamatay na look',
    region: 'manila_bay',
    theme_en: 'Water Pollution',
    theme_fil: 'Polusyon sa Tubig',
    enemy: 'mantsa',
    guardian: 'alon',
    isLocked: true,
    summary_en: 'The rivers are dead. Manila Bay is a graveyard of marine life. Awakening Alon requires diving into waters so toxic they burn. The battle with Mantsa is fought underwater.',
    summary_fil: 'Patay na ang mga ilog. Ang Manila Bay ay sementeryo ng buhay-dagat. Ang paggising kay Alon ay nangangailangan ng pagsisid sa tubig na sobrang lason.',
    quote_en: 'Water is life. And life is easy to kill.',
    quote_fil: 'Ang tubig ay buhay. At ang buhay ay madaling patayin.',
    unlocks: {
      regions: ['manila_bay'],
      guardians: ['alon'],
      generals: ['mantsa'],
      codexEntries: ['alon_lore', 'mantsa_lore', 'water_pollution'],
      achievements: ['tears_cleansed'],
    },
    scenes: [
      {
        id: 'ch2_01',
        type: 'narration',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'The Pasig River was once the lifeblood of Manila. Now it runs gray and lifeless, carrying the waste of millions into Manila Bay. The bay itself is a graveyard — fish float belly-up, the water smells of chemicals, and the sunset is beautiful only because the pollution colors it.',
            text_fil: 'Ang Ilog Pasig ay dating dugo ng Maynila. Ngayon kulay abo at walang buhay ito, dinadala ang basura ng milyon-milyon sa Look ng Maynila. Ang look ay isang sementeryo — lumulutang ang mga isda na nakataob, amoy kemikal ang tubig.',
          },
        ],
        nextScene: 'ch2_02',
      },
      {
        id: 'ch2_02',
        type: 'dialogue',
        dialogues: [
          {
            speaker: 'guardian',
            speakerName: 'Luntian',
            text_en: 'Alon sleeps beneath these waters. Once, Alon kept the seas teeming with life. Now... Alon dreams of an ocean that no longer exists.',
            text_fil: 'Si Alon ay natutulog sa ilalim ng tubig na ito. Dati, pinananatili ni Alon ang mga dagat na puno ng buhay. Ngayon... nananaginip si Alon ng karagatang wala na.',
            emotion: 'sad',
          },
        ],
        nextScene: 'ch2_03',
      },
      {
        id: 'ch2_03',
        type: 'dialogue',
        dialogues: [
          {
            speaker: 'general',
            speakerName: 'Mantsa',
            text_en: 'Water is life. And life is easy to kill.',
            text_fil: 'Ang tubig ay buhay. At ang buhay ay madaling patayin.',
            emotion: 'whisper',
          },
        ],
        nextScene: 'ch2_awakening',
      },
      {
        id: 'ch2_awakening',
        type: 'awakening',
        awakenGuardian: 'alon',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Deep beneath the toxic waters, you find Alon — a spirit of flowing water and coral light, trapped under layers of pollution. As you reach out, Alon stirs.',
            text_fil: 'Sa kailaliman ng mga lason na tubig, natagpuan mo si Alon — isang espiritu ng dumadaloy na tubig at liwanag ng korales, nakulong sa ilalim ng mga patong ng polusyon.',
          },
          {
            speaker: 'guardian',
            speakerName: 'Alon',
            text_en: 'The water... remembers. It remembers being clean. Help me remember how to make it clean again.',
            text_fil: 'Ang tubig... naaalala. Naaalala nito ang pagiging malinis. Tulungan mo akong maalala kung paano ito linisin muli.',
            emotion: 'hopeful',
          },
        ],
        nextScene: 'ch2_battle',
      },
      {
        id: 'ch2_battle',
        type: 'battle',
        battleConfig: {
          guardian: 'alon',
          general: 'mantsa',
          isBossFight: true,
        },
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Mantsa rises from the depths — a figure of iridescent oil and chemical runoff, colors swirling across its surface like a poisoned rainbow. The battle is fought underwater, in a world of ghostly beauty and terrible loss.',
            text_fil: 'Bumangon si Mantsa mula sa kailaliman — isang pigura ng iridescent na langis at chemical runoff, mga kulay na umiikot sa ibabaw nito tulad ng lasonang bahaghari.',
          },
        ],
        nextScene: 'ch2_victory',
      },
      {
        id: 'ch2_victory',
        type: 'cutscene',
        dialogues: [
          {
            speaker: 'narrator',
            text_en: 'Mantsa falls and Alon awakens. The water begins to clear — slowly, painfully, like a wound finally allowed to heal. Fish return, one by one. The bay remembers what it was.',
            text_fil: 'Bumagsak si Mantsa at nagising si Alon. Nagsimulang luminaw ang tubig — dahan-dahan, masakit, tulad ng sugat na sa wakas ay pinaghilom. Bumalik ang mga isda, isa-isa.',
          },
        ],
        nextScene: undefined,
      },
    ],
  },

  /* ── CHAPTER 3: Dugo ng Bundok ── */
  {
    id: 'chapter_3',
    saga: 1,
    chapterNumber: 3,
    title_en: 'Blood of the Mountain',
    title_fil: 'Dugo ng Bundok',
    subtitle_en: 'Deep into the wounded earth',
    subtitle_fil: 'Sa kailaliman ng sugatan na lupa',
    region: 'cordillera',
    theme_en: 'Illegal Mining',
    theme_fil: 'Iligal na Pagmimina',
    enemy: 'hukay',
    guardian: 'bulkan',
    isLocked: true,
    summary_en: 'The mountains are scarred. Rivers run orange with mercury. The quest to free Bulkan leads deep underground, into mines that should never have been dug.',
    summary_fil: 'Sugatan ang mga bundok. Kulay orange ang mga ilog dahil sa mercury. Ang paghahanap kay Bulkan ay nagdadala sa kailaliman ng lupa.',
    quote_en: 'You wanted gold. I gave you death.',
    quote_fil: 'Ginusto niyo ang ginto. Binigay ko ang kamatayan.',
    unlocks: {
      regions: ['cordillera'],
      guardians: ['bulkan'],
      generals: ['hukay'],
      codexEntries: ['bulkan_lore', 'hukay_lore', 'illegal_mining'],
      achievements: ['mountain_healed'],
    },
    scenes: [
      {
        id: 'ch3_01', type: 'narration',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'The Cordillera. Sacred mountains carved with ancient rice terraces. But now, deep scars cut across the landscape — illegal mines that bleed the earth of its riches and poison its rivers with mercury and cyanide.',
          text_fil: 'Ang Kordilyera. Mga sagradong bundok na inukit ng sinaunang hagdan-hagdang palayan. Ngunit ngayon, malalim na sugat ang tumatagas sa tanawin — mga iligal na minahan.',
        }],
        nextScene: 'ch3_02',
      },
      {
        id: 'ch3_02', type: 'dialogue',
        dialogues: [{
          speaker: 'general', speakerName: 'Hukay',
          text_en: 'You wanted gold. I gave you death.',
          text_fil: 'Ginusto niyo ang ginto. Binigay ko ang kamatayan.',
          emotion: 'angry',
        }],
        nextScene: 'ch3_awakening',
      },
      {
        id: 'ch3_awakening', type: 'awakening', awakenGuardian: 'bulkan',
        dialogues: [{
          speaker: 'guardian', speakerName: 'Bulkan',
          text_en: 'The mountain remembers its strength. I will protect what remains.',
          text_fil: 'Naaalala ng bundok ang lakas nito. Poprotektahan ko ang natitira.',
          emotion: 'determined',
        }],
        nextScene: 'ch3_battle',
      },
      {
        id: 'ch3_battle', type: 'battle',
        battleConfig: { guardian: 'bulkan', general: 'hukay', isBossFight: true },
        dialogues: [{
          speaker: 'narrator',
          text_en: 'The mountain shakes as Hukay rises — a hulking figure of exposed rock, mercury, and cyanide. Bulkan meets it with the fury of a volcano.',
          text_fil: 'Yumanig ang bundok habang bumangon si Hukay. Sinalubong ito ni Bulkan ng galit ng bulkan.',
        }],
        nextScene: 'ch3_victory',
      },
      {
        id: 'ch3_victory', type: 'cutscene',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Hukay falls and Bulkan awakens fully. The earth begins to mend — slowly, the way mountains do everything. The rivers start to clear.',
          text_fil: 'Bumagsak si Hukay at ganap na nagising si Bulkan. Nagsimulang maghilom ang lupa — dahan-dahan, sa paraan ng mga bundok.',
        }],
        nextScene: undefined,
      },
    ],
  },

  /* ── CHAPTER 4: Huling Huni ── */
  {
    id: 'chapter_4',
    saga: 1,
    chapterNumber: 4,
    title_en: 'Last Song',
    title_fil: 'Huling Huni',
    subtitle_en: 'The silence of dying forests',
    subtitle_fil: 'Ang katahimikan ng namamatay na kagubatan',
    region: 'mindanao_forest',
    theme_en: 'Deforestation',
    theme_fil: 'Pagkakalbo ng Kagubatan',
    enemy: 'putol',
    guardian: 'haribon',
    isLocked: true,
    summary_en: 'The forest is dying in real-time. Trees fall around you as you walk. The silence is the worst part — where there should be birdsong, there is nothing.',
    summary_fil: 'Namamatay ang kagubatan sa harap mo. Bumabagsak ang mga puno sa paligid mo habang naglalakad ka. Ang katahimikan ang pinakamasama — kung saan dapat may awit ng ibon, wala.',
    quote_en: 'Every tree that was cut became part of me.',
    quote_fil: 'Bawat puno na pinutol, bahagi ko na.',
    unlocks: {
      regions: ['mindanao_forest'],
      guardians: ['haribon'],
      generals: ['putol'],
      codexEntries: ['haribon_lore', 'putol_lore', 'deforestation'],
      achievements: ['forest_sings'],
    },
    scenes: [
      {
        id: 'ch4_01', type: 'narration',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Mindanao. The last great forests of the Philippines. But they are shrinking daily. You walk through what remains — past stumps that were once ancient trees, past empty nests and abandoned burrows. The silence is deafening.',
          text_fil: 'Mindanao. Ang huling malalaking kagubatan ng Pilipinas. Ngunit lumiliit ang mga ito araw-araw. Naglalakad ka sa natitira — dumadaan sa mga tuod na dating sinaunang puno.',
        }],
        nextScene: 'ch4_02',
      },
      {
        id: 'ch4_02', type: 'dialogue',
        dialogues: [{
          speaker: 'general', speakerName: 'Putol',
          text_en: 'Every tree that was cut became part of me.',
          text_fil: 'Bawat puno na pinutol, bahagi ko na.',
          emotion: 'whisper',
        }],
        nextScene: 'ch4_awakening',
      },
      {
        id: 'ch4_awakening', type: 'awakening', awakenGuardian: 'haribon',
        dialogues: [{
          speaker: 'guardian', speakerName: 'Haribon',
          text_en: 'I have been searching for a tree tall enough to perch on. Perhaps... you are that tree.',
          text_fil: 'Naghahanap ako ng punong sapat ang taas para dungawan. Marahil... ikaw ang punong iyon.',
          emotion: 'hopeful',
        }],
        nextScene: 'ch4_battle',
      },
      {
        id: 'ch4_battle', type: 'battle',
        battleConfig: { guardian: 'haribon', general: 'putol', isBossFight: true },
        dialogues: [{
          speaker: 'narrator',
          text_en: 'The battle with Putol is fought among falling trees, in a forest that is being destroyed even as you try to save it. Haribon dives from the sky with devastating force.',
          text_fil: 'Ang laban kay Putol ay nilalabanan sa gitna ng bumabagsak na mga puno. Sumisid si Haribon mula sa langit na may mapaminsalang puwersa.',
        }],
        nextScene: 'ch4_victory',
      },
      {
        id: 'ch4_victory', type: 'cutscene',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Putol falls and Haribon spreads its wings again. The forest exhales — and begins, ever so slowly, to grow.',
          text_fil: 'Bumagsak si Putol at ibinuka muli ni Haribon ang kanyang mga pakpak. Huminga ang kagubatan — at nagsimula, nang dahan-dahan, na tumubo.',
        }],
        nextScene: undefined,
      },
    ],
  },

  /* ── CHAPTER 5: Kailaliman ── */
  {
    id: 'chapter_5',
    saga: 1,
    chapterNumber: 5,
    title_en: 'The Depths',
    title_fil: 'Kailaliman',
    subtitle_en: 'Into the dying reef',
    subtitle_fil: 'Sa namamatay na bahura',
    region: 'tubbataha_reef',
    theme_en: 'Ocean Pollution',
    theme_fil: 'Polusyon sa Karagatan',
    enemy: 'lason',
    guardian: 'pawikan',
    isLocked: true,
    summary_en: 'The reef is bleached white. The ocean floor is carpeted with plastic. Freeing Pawikan from the ghost net is a race against time as the ancient turtle slowly suffocates.',
    summary_fil: 'Puting-puti na ang bahura. Natatakpan ng plastik ang sahig ng dagat. Ang pagpapalaya kay Pawikan mula sa ghost net ay isang karera laban sa oras.',
    quote_en: 'You hid me in the depths. Now, I am rising.',
    quote_fil: 'Itinago niyo ako sa kailaliman. Ngayon, umaakyat na ako.',
    unlocks: {
      regions: ['tubbataha_reef'],
      guardians: ['pawikan'],
      generals: ['lason'],
      codexEntries: ['pawikan_lore', 'lason_lore', 'ocean_pollution'],
      achievements: ['reef_restored'],
    },
    scenes: [
      {
        id: 'ch5_01', type: 'narration',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Tubbataha Reef. Once the most vibrant marine ecosystem in Southeast Asia. Now silent and colorless. The ocean floor is carpeted with plastic — bags, bottles, straws, sachets — an endless graveyard of human convenience.',
          text_fil: 'Tubbataha Reef. Dating ang pinaka-makulay na ekosistema sa dagat ng Timog-Silangang Asya. Ngayon tahimik at walang kulay. Natatakpan ng plastik ang sahig ng dagat.',
        }],
        nextScene: 'ch5_02',
      },
      {
        id: 'ch5_02', type: 'dialogue',
        dialogues: [{
          speaker: 'general', speakerName: 'Lason',
          text_en: 'You hid me in the depths. Now, I am rising.',
          text_fil: 'Itinago niyo ako sa kailaliman. Ngayon, umaakyat na ako.',
          emotion: 'angry',
        }],
        nextScene: 'ch5_awakening',
      },
      {
        id: 'ch5_awakening', type: 'awakening', awakenGuardian: 'pawikan',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Deep in the reef, tangled in a ghost net, you find Pawikan — the ancient sea turtle, slowly suffocating. You race against time to free it.',
          text_fil: 'Sa kailaliman ng bahura, nakasabit sa ghost net, natagpuan mo si Pawikan — ang sinaunang pagong-dagat, dahan-dahang nalalason.',
        }, {
          speaker: 'guardian', speakerName: 'Pawikan',
          text_en: 'I have swum these seas for ten thousand years. I remember when the coral was vibrant. Help me see it that way again.',
          text_fil: 'Lumangoy ako sa mga dagat na ito sa loob ng sampung libong taon. Naaalala ko noong makulay ang korales. Tulungan mo akong makita iyon muli.',
          emotion: 'hopeful',
        }],
        nextScene: 'ch5_battle',
      },
      {
        id: 'ch5_battle', type: 'battle',
        battleConfig: { guardian: 'pawikan', general: 'lason', isBossFight: true },
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Lason rises from the deep — a vast, shapeless mass of plastic, chemical sludge, and dead marine life. The battle is fought in darkness, against an enemy literally made of humanity\'s garbage.',
          text_fil: 'Bumangon si Lason mula sa kailaliman — isang malawak na masa ng plastik, chemical sludge, at patay na buhay-dagat.',
        }],
        nextScene: 'ch5_victory',
      },
      {
        id: 'ch5_victory', type: 'cutscene',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Lason falls and Pawikan swims free. Color returns to the reef — coral by coral, fish by fish, like watching a painting being restored one brushstroke at a time.',
          text_fil: 'Bumagsak si Lason at lumangoy nang malaya si Pawikan. Bumalik ang kulay sa bahura — korales sa korales, isda sa isda.',
        }],
        nextScene: undefined,
      },
    ],
  },

  /* ── CHAPTER 6: Ang Huling Laban ── */
  {
    id: 'chapter_6',
    saga: 1,
    chapterNumber: 6,
    title_en: 'The Final Battle',
    title_fil: 'Ang Huling Laban',
    subtitle_en: 'All of the Philippines at stake',
    subtitle_fil: 'Ang buong Pilipinas ang nakataya',
    region: 'all',
    theme_en: 'Total Environmental War',
    theme_fil: 'Kabuuang Digmaan sa Kalikasan',
    enemy: 'ang_dumi',
    isLocked: true,
    summary_en: 'All five Generals are defeated. All four Guardians stand alongside you. Ang Dumi rises one final time — a massive, writhing storm of every form of pollution combined.',
    summary_fil: 'Natalo na ang limang Heneral. Ang apat na Tagapag-alaga ay nakatayo sa tabi mo. Bumangon si Ang Dumi sa huling pagkakataon.',
    quote_en: 'You did not create me. You raised me.',
    quote_fil: 'Hindi niyo ako nilikha. Kayo ang nagpalaki sa akin.',
    unlocks: {
      codexEntries: ['ang_dumi_lore', 'kalikasan'],
      achievements: ['saga_1_complete', 'kalikasan_awakened'],
    },
    scenes: [
      {
        id: 'ch6_01', type: 'narration',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'All five Generals are defeated. All four Guardians stand alongside you. Luntian has grown from a trembling sprout into a radiant spirit of living green. The Philippines is healing. But Ang Dumi is not dead.',
          text_fil: 'Natalo na ang limang Heneral. Ang apat na Tagapag-alaga ay nakatayo sa tabi mo. Si Luntian ay lumaki mula sa nanginginig na usbong tungo sa isang nagniningning na espiritu ng buhay na berde.',
        }],
        nextScene: 'ch6_02',
      },
      {
        id: 'ch6_02', type: 'dialogue',
        dialogues: [{
          speaker: 'general', speakerName: 'Ang Dumi',
          text_en: 'You did not create me. You raised me. I am every choice you made. Every tree you cut. Every river you poisoned. Every sky you darkened. I am YOU.',
          text_fil: 'Hindi niyo ako nilikha. Kayo ang nagpalaki sa akin. Ako ang bawat pagpiling ginawa niyo. Bawat punong pinutol. Bawat ilog na nilason. Bawat langit na pinadilim. Ako KAYO.',
          emotion: 'angry',
        }],
        nextScene: 'ch6_battle',
      },
      {
        id: 'ch6_battle', type: 'battle',
        battleConfig: { guardian: 'luntian', general: 'ang_dumi', isBossFight: true },
        dialogues: [{
          speaker: 'narrator',
          text_en: 'Ang Dumi rises — a colossal storm of smoke, sludge, rock, dead wood, and ocean trash. The final battle is fought on five fronts simultaneously.',
          text_fil: 'Bumangon si Ang Dumi — isang napakalaking bagyo ng usok, putik, bato, patay na kahoy, at basura sa dagat. Ang huling laban ay nilalabanan sa limang larangan sabay-sabay.',
        }],
        nextScene: 'ch6_climax',
      },
      {
        id: 'ch6_climax', type: 'cutscene',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'In the climactic moment, all five spirits — Luntian, Alon, Bulkan, Haribon, and Pawikan — merge into a single, radiant entity: KALIKASAN. Nature itself. A being of pure life, light, and renewal.',
          text_fil: 'Sa pinakarurok na sandali, ang limang espiritu — Luntian, Alon, Bulkan, Haribon, at Pawikan — ay nagsanib sa isang nagniningning na entidad: KALIKASAN. Ang Kalikasan mismo.',
        }, {
          speaker: 'narrator',
          text_en: 'Kalikasan does not destroy Dumi. It absorbs it. Smoke becomes wind. Sludge becomes rain. Dead wood becomes soil. Plastic becomes sand. Dumi screams — not in pain, but in confusion. It has never been purified before.',
          text_fil: 'Hindi sinira ni Kalikasan si Dumi. Sinipsip niya ito. Ang usok ay naging hangin. Ang putik ay naging ulan. Ang patay na kahoy ay naging lupa. Ang plastik ay naging buhangin.',
        }],
        nextScene: 'ch6_ending',
      },
      {
        id: 'ch6_ending', type: 'cutscene',
        dialogues: [{
          speaker: 'guardian', speakerName: 'Luntian',
          text_en: 'You did it. We did it. The Philippines is alive again.',
          text_fil: 'Nagawa mo. Nagawa natin. Ang Pilipinas ay buhay na muli.',
          emotion: 'hopeful',
        }, {
          speaker: 'narrator',
          text_en: 'The credits roll. The player believes the story is over.',
          text_fil: 'Umandar ang mga credits. Naniniwala ang manlalaro na tapos na ang kwento.',
        }],
        nextScene: 'ch6_postcredits',
      },
      {
        id: 'ch6_postcredits', type: 'cutscene',
        dialogues: [{
          speaker: 'narrator',
          text_en: 'A quiet room. A government office. A man signs a document labeled "Environmental Compliance Certificate — APPROVED." The assessment section is blank. Outside, a restored forest stands tall.',
          text_fil: 'Isang tahimik na silid. Isang opisina ng gobyerno. Isang lalaki ang pumirma ng dokumentong may label na "Environmental Compliance Certificate — APPROVED." Blangko ang assessment section.',
        }, {
          speaker: 'npc',
          speakerName: '???',
          text_en: 'Yes, Governor. It\'s done. The permit is signed. They can start clearing next month.',
          text_fil: 'Opo, Gobernador. Tapos na po. Napirmahan na ang permit. Maaari na silang magsimulang magbaklas sa susunod na buwan.',
        }, {
          speaker: 'narrator',
          text_en: 'Somewhere, deep beneath the earth, something stirs. A whisper:',
          text_fil: 'Sa kung saan, malalim sa ilalim ng lupa, may gumalaw. Isang bulong:',
        }, {
          speaker: 'general', speakerName: '???',
          text_en: 'You cannot kill me. Because I am not a monster. I am human.',
          text_fil: 'Hindi mo ako kayang patayin. Dahil hindi ako halimaw. Ako ay tao.',
          emotion: 'whisper',
        }],
        nextScene: undefined,
      },
    ],
  },
]

/* ═══════════════════════════════════════════════
   COMPLETE SAGA DATA
   ═══════════════════════════════════════════════ */

export const SAGAS: Saga[] = [
  {
    id: 1,
    title_en: 'The Awakening',
    title_fil: 'Ang Paggising',
    subtitle_en: 'The Battle for Nature\'s Soul',
    subtitle_fil: 'Ang Laban para sa Kaluluwa ng Kalikasan',
    chapters: SAGA_I_CHAPTERS,
  },
  {
    id: 2,
    title_en: 'The Decay',
    title_fil: 'Ang Pagkabulok',
    subtitle_en: 'The War Within',
    subtitle_fil: 'Ang Digmaan sa Loob',
    chapters: [], // Saga II chapters — to be added later!
  },
]

/* ═══════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════ */

export function getChapter(chapterId: string): StoryChapter | undefined {
  for (const saga of SAGAS) {
    const chapter = saga.chapters.find((c) => c.id === chapterId)
    if (chapter) return chapter
  }
  return undefined
}

export function getNextChapter(currentId: string): StoryChapter | undefined {
  for (const saga of SAGAS) {
    const idx = saga.chapters.findIndex((c) => c.id === currentId)
    if (idx !== -1 && idx < saga.chapters.length - 1) {
      return saga.chapters[idx + 1]
    }
  }
  return undefined
}

export function getAllChapters(): StoryChapter[] {
  return SAGAS.flatMap((s) => s.chapters)
}

export function getChaptersByRegion(regionName: string): StoryChapter[] {
  return getAllChapters().filter((c) => c.region === regionName)
}

export function getSagaChapters(sagaId: number): StoryChapter[] {
  return SAGAS.find((s) => s.id === sagaId)?.chapters ?? []
}