/**
 * 💀 LUNTIAN ANGLARO — General Detail Page
 * Full lore, stats, 3D model preview, weakness info,
 * and region details for each General of Pollution.
 */
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { useGameStore } from '@/store'
import { ELEMENT_CONFIG } from '@/types/game.types'
import { GeneralModelLookup } from '@/components/battle3d/GuardianModels'

/* ── Extended lore for each General ── */
const GENERAL_LORE: Record<string, {
  title_en: string
  title_fil: string
  origin_en: string
  origin_fil: string
  lore_en: string[]
  lore_fil: string[]
  powers: string[]
  battle_style_en: string
  battle_style_fil: string
  threat_level: string
  corruption_en: string
  corruption_fil: string
}> = {
  usok: {
    title_en: 'The Smoke General',
    title_fil: 'Ang Heneral ng Usok',
    origin_en: 'Born from the First Factory',
    origin_fil: 'Ipinanganak mula sa Unang Pabrika',
    lore_en: [
      'Usok was born when the first factories rose in Metro Manila, their smokestacks belching poison into the sky. As the smog thickened, a consciousness formed within the haze — angry, suffocating, and hungry for more.',
      'He feeds on every exhaust pipe, every burning garbage heap, every coal plant that darkens the Philippine sky. His body is a living storm of particulate matter, carbon monoxide, and sulfur dioxide.',
      'Where Usok walks, the air turns gray. Birds fall from the sky. Children gasp for breath. He is the reason Manila\'s sunsets are beautiful — and deadly.',
    ],
    lore_fil: [
      'Si Usok ay ipinanganak nang umusbong ang mga unang pabrika sa Metro Manila, ang kanilang mga smokestack ay naglalabas ng lason sa langit. Habang kumakapal ang usok, isang kamalayan ang nabuo sa loob ng hamog — galit, nakakabigat ng paghinga, at gutom pa sa mas marami.',
      'Siya ay kumakain mula sa bawat tambutso, bawat nasusunog na basura, bawat planta ng karbon na nagpapadilim sa langit ng Pilipinas.',
      'Kung saan naglalakad si Usok, kulay abo ang hangin. Nahuhulog ang mga ibon mula sa langit. Hinahabol ng mga bata ang kanilang hininga.',
    ],
    powers: ['Smog Blast', 'Choking Cloud', 'Carbon Storm'],
    battle_style_en: 'Usok fights by suffocating his opponents, reducing their accuracy and slowly draining HP with poison damage over time.',
    battle_style_fil: 'Si Usok ay lumalaban sa pamamagitan ng pagsakal sa kanyang mga kalaban, binabawasan ang kanilang accuracy at dahan-dahang inaalis ang HP.',
    threat_level: 'HIGH',
    corruption_en: 'Air Quality Index reaches hazardous levels across Metro Manila. Respiratory diseases spike by 300%.',
    corruption_fil: 'Ang Air Quality Index ay umabot sa mapanganib na antas sa buong Metro Manila. Tumaas ng 300% ang mga sakit sa baga.',
  },
  mantsa: {
    title_en: 'The Stain General',
    title_fil: 'Ang Heneral ng Mantsa',
    origin_en: 'Born from Manila Bay\'s Dying Waters',
    origin_fil: 'Ipinanganak mula sa Namamatay na Tubig ng Manila Bay',
    lore_en: [
      'Mantsa emerged from the toxic waters of Manila Bay — a creature of industrial runoff, sewage, and chemical waste. Its body shimmers with an oil-slick iridescence, beautiful and deadly.',
      'It carries a corrupted staff made from dead mangrove roots, topped with a sphere of concentrated pollution that glows with sickly green light.',
      'Every river that feeds into Manila Bay strengthens Mantsa. Every factory that dumps waste feeds its power. It is the living embodiment of water contamination.',
    ],
    lore_fil: [
      'Si Mantsa ay lumitaw mula sa mga lasonng tubig ng Manila Bay — isang nilalang ng industrial runoff, dumi, at chemical waste.',
      'May dala itong isang corrupted staff na gawa sa mga patay na ugat ng bakawan, na may globo ng concentrated pollution sa dulo.',
      'Bawat ilog na dumadaloy sa Manila Bay ay nagpapalakas kay Mantsa. Bawat pabrika na nagtatapon ng basura ay nagpapakain sa kanyang kapangyarihan.',
    ],
    powers: ['Toxic Surge', 'Oil Slick', 'Acid Rain'],
    battle_style_en: 'Mantsa corrodes defenses over time, applying stacking poison effects that intensify each turn.',
    battle_style_fil: 'Kinakalawang ni Mantsa ang mga depensa sa paglipas ng panahon, naglalagay ng patong-patong na lason.',
    threat_level: 'HIGH',
    corruption_en: 'Manila Bay turns black. Marine life dies en masse. Fishing communities lose their livelihood.',
    corruption_fil: 'Naging itim ang Manila Bay. Namamatay ang mga buhay sa dagat. Nawawalan ng kabuhayan ang mga mangingisda.',
  },
  hukay: {
    title_en: 'The Pit General',
    title_fil: 'Ang Heneral ng Hukay',
    origin_en: 'Born from the Wounded Mountains',
    origin_fil: 'Ipinanganak mula sa Sugatan na mga Bundok',
    lore_en: [
      'Hukay rose from the scarred mountains of the Cordillera, where illegal mining operations carved deep wounds into the earth. Stone and metal fused with rage to create a golem of destruction.',
      'Its body is cracked stone laced with glowing orange lava — the earth\'s bleeding wounds made manifest. Rebar and mining equipment jut from its shoulders like broken bones.',
      'Hukay does not walk — it earthquakes. Every step sends tremors through the ground, collapsing tunnels and swallowing villages. It is the mountain\'s vengeance for humanity\'s greed.',
    ],
    lore_fil: [
      'Si Hukay ay bumangon mula sa mga sugatan na bundok ng Cordillera, kung saan kinakahig ng illegal mining ang malalim na sugat sa lupa.',
      'Ang katawan nito ay basag na bato na may kumikinang na orange na lava — ang dumudugo na mga sugat ng lupa.',
      'Hindi naglalakad si Hukay — lindol ito. Bawat hakbang ay nagpapadala ng mga pagyanig sa lupa.',
    ],
    powers: ['Seismic Slam', 'Rockslide', 'Magma Eruption'],
    battle_style_en: 'Hukay is a tank — slow but devastating. Each hit deals massive damage and has a chance to stun.',
    battle_style_fil: 'Si Hukay ay isang tangke — mabagal ngunit mapaminsala. Bawat suntok ay may malaking pinsala.',
    threat_level: 'EXTREME',
    corruption_en: 'Mountains collapse. Rivers turn orange with mine tailings. Indigenous communities are displaced.',
    corruption_fil: 'Gumuguho ang mga bundok. Kulay orange ang mga ilog dahil sa mine tailings. Naaalis ang mga katutubong komunidad.',
  },
  putol: {
    title_en: 'The Chainsaw General',
    title_fil: 'Ang Heneral ng Putol',
    origin_en: 'Born from the Last Ancient Tree',
    origin_fil: 'Ipinanganak mula sa Huling Sinaunang Puno',
    lore_en: [
      'Putol was once the spirit of an ancient Philippine mahogany — a thousand-year-old tree in the heart of Mindanao\'s rainforest. When illegal loggers cut it down, its spirit did not die. It twisted.',
      'Now Putol is a corrupted treant — its body made of splintered, dead wood, its arms transformed into massive chainsaw blades. It has become the very thing that destroyed it.',
      'It roams the forests of Mindanao, not to protect them, but to finish what the loggers started. In its madness, it believes that if no trees remain, no trees can be hurt.',
    ],
    lore_fil: [
      'Si Putol ay dating espiritu ng isang sinaunang Philippine mahogany — isang libong taong gulang na puno sa gitna ng kagubatan ng Mindanao.',
      'Ngayon si Putol ay isang corrupted treant — ang katawan nito ay gawa sa basag na patay na kahoy, ang mga braso nito ay naging malalaking chainsaw blades.',
      'Gumagala ito sa mga kagubatan ng Mindanao, hindi upang protektahan sila, kundi upang tapusin ang sinimulan ng mga illegal loggers.',
    ],
    powers: ['Timber Strike', 'Sawdust Storm', 'Deadwood Curse'],
    battle_style_en: 'Putol attacks in rapid chains — fast, relentless, and increasingly frenzied as its HP drops.',
    battle_style_fil: 'Si Putol ay umaatake nang sunod-sunod — mabilis, walang tigil, at lalong nababaliw habang bumababa ang HP.',
    threat_level: 'HIGH',
    corruption_en: 'Forest cover drops below 20%. Landslides bury entire barangays. Endemic species go extinct.',
    corruption_fil: 'Bumaba sa ibaba ng 20% ang forest cover. Tinatakpan ng landslides ang mga barangay. Namamatay ang mga endemic species.',
  },
  lason: {
    title_en: 'The Poison General',
    title_fil: 'Ang Heneral ng Lason',
    origin_en: 'Born from the Dying Reef',
    origin_fil: 'Ipinanganak mula sa Namamatay na Bahura',
    lore_en: [
      'Lason coalesced from the garbage patches of the Philippine Sea — a kraken-like horror made of plastic bottles, fishing nets, toxic waste, and dead marine life fused together by corruption.',
      'Its body is a writhing mass of ocean trash with tentacles of tangled debris. A shark\'s jaw protrudes from its face — the last remnant of a great white that choked on plastic bags.',
      'Glowing yellow eyes peer from within the garbage mass, and wherever its tentacles touch, the water turns to poison. Coral bleaches. Fish die. The reef becomes a graveyard.',
    ],
    lore_fil: [
      'Si Lason ay nabuo mula sa mga garbage patch ng Philippine Sea — isang kraken-like na kakilakilabot na gawa sa mga plastic bottle, lambat, toxic waste, at mga patay na buhay-dagat.',
      'Ang katawan nito ay isang gumagalaw na masa ng basura sa dagat na may mga tentacles ng magkakasabid na debris.',
      'Mga kulay dilaw na mata ang sumisilip mula sa loob ng masa ng basura, at saan man dumampi ang mga tentacles nito, nagiging lason ang tubig.',
    ],
    powers: ['Tentacle Lash', 'Poison Tide', 'Plastic Suffocation'],
    battle_style_en: 'Lason attacks from multiple angles with its tentacles, applying poison and reducing movement speed.',
    battle_style_fil: 'Si Lason ay umaatake mula sa maraming anggulo gamit ang mga tentacles nito, naglalagay ng lason.',
    threat_level: 'HIGH',
    corruption_en: 'Tubbataha Reef bleaches completely. Marine biodiversity drops by 70%. Fishing industry collapses.',
    corruption_fil: 'Ganap na namamuti ang Tubbataha Reef. Bumaba ng 70% ang marine biodiversity. Bumagsak ang industriya ng pangingisda.',
  },
  ang_dumi: {
    title_en: 'The Final Boss — Embodiment of All Pollution',
    title_fil: 'Ang Huling Boss — Sagisag ng Lahat ng Polusyon',
    origin_en: 'Born When All Five Generals United',
    origin_fil: 'Ipinanganak Nang Nagkaisa ang Limang Heneral',
    lore_en: [
      'Ang Dumi is not a creature — it is an event. When all five Generals of Pollution reach their peak power, their corruption merges into a single, colossal entity that threatens to consume the entire Philippine archipelago.',
      'Its body is an amalgamation of all pollution: smoke forms its upper body, toxic sludge its torso, mining debris its limbs, dead wood its spine, and ocean trash its lower half. Multiple mismatched eyes glow in different colors — each one a remnant of a defeated General.',
      'At its center pulses a dark void — the core of all corruption. If Ang Dumi is not stopped, the Philippines will become uninhabitable. The land will die. The sea will die. The air will die. Everything will become... dumi.',
    ],
    lore_fil: [
      'Si Ang Dumi ay hindi isang nilalang — ito ay isang pangyayari. Kapag ang limang Heneral ng Polusyon ay umabot sa kanilang pinakamataas na kapangyarihan, ang kanilang kabulukan ay nagsasama sa isang napakalaking entidad.',
      'Ang katawan nito ay pinagsama-samang polusyon: usok ang itaas ng katawan, toxic sludge ang torso, mining debris ang mga paa, patay na kahoy ang gulugod, at basura sa dagat ang ibaba.',
      'Sa gitna nito ay pumipintig ang isang madilim na kawalan — ang core ng lahat ng kabulukan. Kung hindi mapipigilan si Ang Dumi, ang Pilipinas ay magiging hindi na matirahan.',
    ],
    powers: ['Void Pulse', 'All-Element Storm', 'Corruption Wave', 'Extinction Event', 'Dark Convergence'],
    battle_style_en: 'Ang Dumi cycles through all elemental attacks, growing stronger each phase. It has 5 battle phases — one for each General it absorbed.',
    battle_style_fil: 'Si Ang Dumi ay nagbabago-bago ng elemental attacks, lumalakas sa bawat phase. May 5 battle phases — isa para sa bawat General na sinipsip nito.',
    threat_level: 'CATASTROPHIC',
    corruption_en: 'Total environmental collapse. The Philippine archipelago faces extinction-level ecological disaster.',
    corruption_fil: 'Ganap na pagbagsak ng kapaligiran. Ang Pilipinas ay nahaharap sa extinction-level na sakuna sa ekolohiya.',
  },
}

/* ── Threat type colors ── */
const THREAT_COLORS: Record<string, string> = {
  AIR: '#78909C',
  WATER: '#7B1FA2',
  MINING: '#FF6D00',
  FOREST: '#FF8F00',
  OCEAN: '#00897B',
  FINAL: '#D50000',
  CORRUPT: '#D50000',
}

export default function GeneralDetailPage() {
  const { generalName } = useParams<{ generalName: string }>()
  const navigate = useNavigate()
  const { generals, language } = useGameStore()

  const general = generals.find((g) => g.name === generalName)
  if (!general) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">General not found.</p>
        <button onClick={() => navigate('/generals')} className="mt-4 text-[var(--luntian-primary)] underline">
          ← Back to Generals
        </button>
      </div>
    )
  }

  const lore = GENERAL_LORE[general.name]
  const isFil = language === 'fil'
  const threatColor = THREAT_COLORS[general.threat_type] || '#EF5350'

  // Find the guardian weakness
  const guardianWeakness = general.weakness
  const weakGuardian = useGameStore.getState().guardians.find(g => g.name === guardianWeakness)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/generals')}
        className="text-sm text-[var(--luntian-text-muted)] hover:text-red-400 transition-colors"
      >
        ← {isFil ? 'Bumalik sa mga Heneral' : 'Back to Generals'}
      </button>

      {/* ═══ HEADER ═══ */}
      <div className="flex items-start gap-6">
        {/* ═══ 3D MODEL SHOWCASE — Center Stage ═══ */}
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-red-900/30 bg-[#0a0505] mb-6">
        <Canvas camera={{ position: [0, 2, 5], fov: 35 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <pointLight position={[-2, 3, 2]} intensity={0.6} color={threatColor} />
            <pointLight position={[2, 1, -2]} intensity={0.4} color={threatColor} />
            <fog attach="fog" args={['#0a0505', 6, 18]} />

            {/* Arena floor for grounding */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <circleGeometry args={[2.5, 48]} />
              <meshStandardMaterial color="#0d0505" metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
              <ringGeometry args={[2.3, 2.5, 48]} />
              <meshStandardMaterial
                color={threatColor}
                emissive={threatColor}
                emissiveIntensity={0.6}
                transparent
                opacity={0.4}
              />
            </mesh>

            <GeneralModelLookup
              name={general.name}
              animPhase="idle"
              hp={100}
              role="general"
              baseX={0}
            />
            <OrbitControls
              enablePan={false}
              autoRotate
              autoRotateSpeed={1.2}
              enableZoom={false}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Suspense>
        </Canvas>

        {/* Overlay gradient at bottom for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--luntian-bg)] to-transparent pointer-events-none" />

        {/* Drag hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-[var(--luntian-text-muted)]/40 pointer-events-none">
          🖱️ Drag to rotate • Auto-spinning 360°
        </div>
      </div>

      {/* ═══ NAME & TITLE — Below the model ═══ */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-4xl">{general.emoji}</span>
          <h1 className="text-4xl font-black" style={{ color: threatColor }}>
            {general.display_name}
          </h1>
        </div>
        <p className="text-sm mb-1" style={{ color: threatColor + 'aa' }}>
          {general.threat_display}
        </p>
        <p className="text-lg font-semibold text-[var(--luntian-text-muted)] italic">
          {lore ? (isFil ? lore.title_fil : lore.title_en) : ''}
        </p>
        <p className="text-xs text-[var(--luntian-text-muted)]/60 mt-1">
          {lore ? (isFil ? lore.origin_fil : lore.origin_en) : ''}
        </p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {lore && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold"
              style={{
                borderColor: threatColor + '40',
                backgroundColor: threatColor + '15',
                color: threatColor,
              }}
            >
              ⚠️ THREAT LEVEL: {lore.threat_level}
            </span>
          )}
          {general.name === 'ang_dumi' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/20 border border-red-900/40 text-xs font-bold text-red-400">
              👑 FINAL BOSS
            </span>
          )}
        </div>
      </div>
      
      {/* ═══ STATS GRID ═══ */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-red-900/15 text-center">
          <div className="text-2xl font-black" style={{ color: threatColor }}>{general.battle_phases}</div>
          <div className="text-[10px] text-[var(--luntian-text-muted)] mt-1">
            {isFil ? 'Mga Phase ng Laban' : 'Battle Phases'}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-red-900/15 text-center">
          <div className="text-2xl font-black text-[var(--luntian-gold)]">Saga {general.saga}</div>
          <div className="text-[10px] text-[var(--luntian-text-muted)] mt-1">Saga</div>
        </div>
        <div className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-red-900/15 text-center">
          <div className="text-2xl font-black text-[var(--luntian-text)]">Ch. {general.chapter}</div>
          <div className="text-[10px] text-[var(--luntian-text-muted)] mt-1">Chapter</div>
        </div>
        <div className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-red-900/15 text-center">
          <div className="text-2xl">📍</div>
          <div className="text-xs text-[var(--luntian-text-muted)] mt-1">{general.region}</div>
        </div>
      </div>

      {/* ═══ WEAKNESS ═══ */}
      {weakGuardian && (
        <div className="rounded-xl p-4 bg-[var(--luntian-surface)] border border-green-900/20">
          <h3 className="text-sm font-bold text-[var(--luntian-primary)] mb-2">
            ⚡ {isFil ? 'Kahinaan' : 'Weakness'}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{weakGuardian.emoji}</span>
            <div>
              <span className="font-bold" style={{ color: ELEMENT_CONFIG[weakGuardian.element].color }}>
                {weakGuardian.display_name}
              </span>
              <span className="text-[var(--luntian-text-muted)] text-sm ml-2">
                ({weakGuardian.element_display})
              </span>
            </div>
            <button
              onClick={() => navigate(`/guardians/${weakGuardian.name}`)}
              className="ml-auto text-xs px-3 py-1 rounded-lg border border-[var(--luntian-primary)]/30 text-[var(--luntian-primary)] hover:bg-[var(--luntian-primary)]/10 transition-colors"
            >
              {isFil ? 'Tingnan' : 'View'} →
            </button>
          </div>
        </div>
      )}

      {/* ═══ LORE ═══ */}
      {lore && (
        <div className="rounded-xl p-5 bg-[var(--luntian-surface)] border border-red-900/15">
          <h3 className="text-sm font-bold mb-3" style={{ color: threatColor }}>
            📜 {isFil ? 'Kasaysayan' : 'Lore'}
          </h3>
          <div className="space-y-3">
            {(isFil ? lore.lore_fil : lore.lore_en).map((paragraph, i) => (
              <p key={i} className="text-sm text-[var(--luntian-text-muted)] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ═══ POWERS ═══ */}
      {lore && (
        <div className="rounded-xl p-5 bg-[var(--luntian-surface)] border border-red-900/15">
          <h3 className="text-sm font-bold mb-3" style={{ color: threatColor }}>
            ⚔️ {isFil ? 'Mga Kapangyarihan' : 'Powers'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {lore.powers.map((power, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                style={{
                  borderColor: threatColor + '40',
                  backgroundColor: threatColor + '15',
                  color: threatColor,
                }}
              >
                {power}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ═══ BATTLE STYLE ═══ */}
      {lore && (
        <div className="rounded-xl p-5 bg-[var(--luntian-surface)] border border-red-900/15">
          <h3 className="text-sm font-bold mb-2" style={{ color: threatColor }}>
            🎯 {isFil ? 'Estilo ng Laban' : 'Battle Style'}
          </h3>
          <p className="text-sm text-[var(--luntian-text-muted)] leading-relaxed">
            {isFil ? lore.battle_style_fil : lore.battle_style_en}
          </p>
        </div>
      )}

      {/* ═══ CORRUPTION EFFECT ═══ */}
      {lore && (
        <div className="rounded-xl p-5 bg-red-950/20 border border-red-900/30">
          <h3 className="text-sm font-bold text-red-400 mb-2">
            ☠️ {isFil ? 'Epekto ng Kabulukan' : 'Corruption Effect'}
          </h3>
          <p className="text-sm text-red-300/70 leading-relaxed">
            {isFil ? lore.corruption_fil : lore.corruption_en}
          </p>
        </div>
      )}

      {/* ═══ BATTLE BUTTON ═══ */}
      <div className="text-center pt-2 pb-8">
        <button
          onClick={() => navigate('/battle')}
          className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: threatColor }}
        >
          ⚔️ {isFil ? `Labanan si ${general.display_name}` : `Battle ${general.display_name}`}
        </button>
      </div>
    </div>
  )
}