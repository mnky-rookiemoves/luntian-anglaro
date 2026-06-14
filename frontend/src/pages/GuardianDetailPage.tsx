/**
 * 🛡️ LUNTIAN ANGLARO — Guardian Detail Page
 * Split layout: Details LEFT, 3D model portrait RIGHT
 */
import { useEffect, useState, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from '@/store'
import { ELEMENT_CONFIG } from '@/types/game.types'
import { GuardianModelLookup } from '@/components/battle3d/GuardianModels'
import type { Guardian, General } from '@/types/game.types'

const POWER_DESCRIPTIONS: Record<string, Record<string, { desc: string; descFil: string; type: string }>> = {
  luntian: {
    'Vine Whip': { desc: 'Lashes enemies with thorny vines. Medium damage, chance to root.', descFil: 'Hinagupit ang mga kalaban ng matinik na baging. Katamtamang pinsala, pagkakataong ma-root.', type: 'Attack' },
    'Root Shield': { desc: 'Summons roots from the earth to form a protective barrier.', descFil: 'Tumawag ng mga ugat mula sa lupa para bumuo ng protektibong hadlang.', type: 'Defense' },
    'Growth Heal': { desc: 'Channels nature energy to restore health over time.', descFil: 'Nagpapadaloy ng enerhiya ng kalikasan para ibalik ang kalusugan sa paglipas ng panahon.', type: 'Heal' },
  },
  alon: {
    'Water Slash': { desc: 'A high-pressure water blade that cuts through armor.', descFil: 'Isang high-pressure na talim ng tubig na tumatagos sa baluti.', type: 'Attack' },
    'Tidal Wave': { desc: 'Summons a massive wave dealing AoE damage to all enemies.', descFil: 'Tumawag ng malaking alon na nagdudulot ng AoE na pinsala sa lahat ng kalaban.', type: 'AoE Attack' },
    'Purify': { desc: 'Cleanses water in the area, healing allies and removing debuffs.', descFil: 'Nilinis ang tubig sa lugar, nagpapagaling sa mga kakampi at nag-aalis ng debuffs.', type: 'Heal + Cleanse' },
  },
  bulkan: {
    'Earth Slam': { desc: 'Slams the ground with massive fists, causing earthquake damage.', descFil: 'Hinampas ang lupa ng malalaking kamao, nagdudulot ng lindol na pinsala.', type: 'Attack' },
    'Rock Wall': { desc: 'Raises a wall of stone that absorbs incoming damage.', descFil: 'Nagtaas ng pader ng bato na sumasalo ng paparating na pinsala.', type: 'Defense' },
    'Seismic Strike': { desc: 'Ultimate — channeled earthquake that devastates all enemies.', descFil: 'Ultimate — channeled na lindol na sumisira sa lahat ng kalaban.', type: 'Ultimate' },
  },
  haribon: {
    'Wind Dash': { desc: 'Dashes at extreme speed, dodging attacks and repositioning.', descFil: 'Tumakbo nang sobrang bilis, umiiwas sa atake at nagbabago ng posisyon.', type: 'Mobility' },
    'Feather Storm': { desc: 'Launches razor-sharp feathers in a wide arc.', descFil: 'Nagpalipad ng matalas na balahibo sa malawak na arko.', type: 'AoE Attack' },
    'Sky Strike': { desc: 'Dives from the sky with devastating force. High crit chance.', descFil: 'Sumisid mula sa langit na may mapaminsalang puwersa. Mataas na crit chance.', type: 'Ultimate' },
  },
  pawikan: {
    'Coral Shield': { desc: 'Encases allies in protective coral armor, reducing damage.', descFil: 'Binalot ang mga kakampi sa protektibong baluti ng korales, binabawasan ang pinsala.', type: 'Defense' },
    'Deep Current': { desc: 'Creates underwater currents that slow and damage enemies.', descFil: 'Gumawa ng mga agos sa ilalim ng tubig na nagpapabagal at nagpipinsala sa mga kalaban.', type: 'CC + Damage' },
    'Bubble Trap': { desc: 'Traps enemies in inescapable bubbles, stunning them.', descFil: 'Nikulong ang mga kalaban sa mga bula na hindi matatakasan, na-stun sila.', type: 'CC + Stun' },
  },
}

const GUARDIAN_LORE: Record<string, { en: string; fil: string }> = {
  luntian: {
    en: 'Luntian is the spirit of Philippine nature itself — born from the first seed planted by the ancient diwata. For millennia, Luntian watched over the forests, rivers, and mountains. But as pollution spread, Luntian fell into a deep slumber, weakened by the dying earth. Now, awakened by the player\'s arrival, Luntian serves as both guide and first Guardian. Though the youngest in power, Luntian\'s connection to the land is the deepest of all Guardians.',
    fil: 'Si Luntian ay ang espiritu ng kalikasan ng Pilipinas — ipinanganak mula sa unang binhing itinanim ng sinaunang diwata. Sa loob ng libu-libong taon, binantayan ni Luntian ang mga kagubatan, ilog, at kabundukan. Ngunit habang kumakalat ang polusyon, natulog nang mahimbing si Luntian, humina dahil sa namamatay na lupa. Ngayon, nagising sa pagdating ng manlalaro, si Luntian ay nagsisilbing gabay at unang Tagapag-alaga.',
  },
  alon: {
    en: 'Alon was once the proud guardian of Manila Bay — a spirit of pure, crystalline water who danced with dolphins and sang with whales. When industrial waste began poisoning the bay, Alon\'s form became murky and dark. Now trapped beneath layers of pollution, Alon waits for a Guardian brave enough to cleanse the waters and restore the ocean\'s voice.',
    fil: 'Si Alon ay dating ang mapagmahal na tagapag-alaga ng Look ng Maynila — isang espiritu ng puro at malinaw na tubig na sumasayaw kasama ang mga dolphin at kumakanta kasama ang mga balyena. Nang magsimulang lasonin ng industriyal na basura ang look, naging malabo at madilim ang anyo ni Alon. Ngayon, nakulong sa ilalim ng mga patong ng polusyon, naghihintay si Alon ng isang Tagapag-alaga na sapat ang tapang para linisin ang tubig.',
  },
  bulkan: {
    en: 'Bulkan is the ancient mountain spirit of the Cordillera — a massive stone golem with a heart of volcanic lava. For centuries, Bulkan maintained the balance between earth and fire, protecting the rice terraces and mountain communities. But illegal mining has scarred the mountains, weakening Bulkan\'s stone body. Deep within the mines, Bulkan waits, ready to unleash the mountain\'s fury against those who defile it.',
    fil: 'Si Bulkan ay ang sinaunang espiritu ng kabundukan ng Kordilyera — isang malaking golem na bato na may pusong lava ng bulkan. Sa loob ng mga siglo, pinanatili ni Bulkan ang balanse sa pagitan ng lupa at apoy. Ngunit sinira ng iligal na pagmimina ang mga bundok, na nagpahina sa katawan na bato ni Bulkan. Sa kailaliman ng mga minahan, naghihintay si Bulkan, handang ilabas ang galit ng bundok.',
  },
  haribon: {
    en: 'Haribon is the wind spirit that takes the form of the Philippine Eagle — the mightiest bird in the archipelago. Once, Haribon soared over endless canopies of green. Now, with the forests shrinking daily to chainsaws and bulldozers, Haribon\'s flight grows shorter and more desperate. The spirit carries the last breath of the forest on its wings, searching for someone who can stop the destruction.',
    fil: 'Si Haribon ay ang espiritu ng hangin na nag-aanyong Agila ng Pilipinas — ang pinakamakapangyarihang ibon sa kapuluan. Dati, lumilipad si Haribon sa walang katapusang berdeng kagubatan. Ngayon, habang lumiliit ang mga kagubatan araw-araw dahil sa mga chainsaw at bulldozer, lumililiit at nagiging desperado ang paglipad ni Haribon. Dala ng espiritu ang huling hininga ng kagubatan sa kanyang mga pakpak.',
  },
  pawikan: {
    en: 'Pawikan is the ancient marine spirit — a sea turtle that has swum the Philippine seas for over 10,000 years. Pawikan remembers when the coral was vibrant and the waters were clear. Now, navigating through plastic waste and oil slicks, Pawikan\'s shell is cracked and scarred. In the depths of Tubbataha Reef, Pawikan guards the last pristine corals, waiting for a hero who can turn the tide.',
    fil: 'Si Pawikan ay ang sinaunang espiritu ng karagatan — isang pagong-dagat na lumangoy sa mga dagat ng Pilipinas sa loob ng mahigit 10,000 taon. Naaalala ni Pawikan noong makulay ang korales at malinaw ang tubig. Ngayon, habang naglalayag sa mga basura ng plastik at langis, basag at may gasgas ang balat ni Pawikan. Sa kailaliman ng Tubbataha Reef, binabantayan ni Pawikan ang huling malinis na korales.',
  },
}

const GuardianDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { guardians, generals, regions, initialize, isInitialized, language } = useGameStore()
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [nemesis, setNemesis] = useState<General | null>(null)

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [initialize, isInitialized])

  useEffect(() => {
    if (guardians.length > 0 && id) {
      const g = guardians.find((g) => g.id === Number(id))
      if (g) {
        setGuardian(g)
        const gen = generals.find((gen) => gen.region_name === g.region_name)
        setNemesis(gen || null)
      }
    }
  }, [guardians, generals, id])

  if (!guardian) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🔮</div>
        <p className="text-[var(--luntian-text-muted)]">Guardian not found...</p>
      </div>
    )
  }

  const config = ELEMENT_CONFIG[guardian.element]
  const powers = POWER_DESCRIPTIONS[guardian.name] || {}
  const lore = GUARDIAN_LORE[guardian.name]
  const region = regions.find((r) => r.name === guardian.region_name)
  const isFil = language === 'fil'

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Back Button */}
      <div className="px-6 py-3 flex-shrink-0">
        <button
          onClick={() => navigate('/guardians')}
          className="text-sm text-[var(--luntian-text-muted)] hover:text-[var(--luntian-primary-light)] transition-colors"
        >
          {isFil ? '← Bumalik sa mga Tagapag-alaga' : '← Back to Guardians'}
        </button>
      </div>

      {/* MAIN SPLIT LAYOUT */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT COLUMN: Details */}
        <div className="w-1/2 overflow-y-auto px-6 pb-6 space-y-4">

          {/* Name & Info */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{config.emoji}</span>
              <h1 className="text-3xl font-black" style={{ color: config.color }}>
                {guardian.display_name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  color: config.color,
                  backgroundColor: `${config.color}22`,
                  border: `1px solid ${config.color}44`,
                }}
              >
                {guardian.element_display}
              </span>
              <span className="text-xs text-[var(--luntian-text-muted)]">
                {guardian.combat_role_display}
              </span>
              <span className="text-xs text-[var(--luntian-text-muted)]">
                Ch.{guardian.awakening_chapter}
              </span>
            </div>
            <p className="text-sm text-[var(--luntian-text-muted)] mt-2">
              {isFil && guardian.description_filipino
                ? guardian.description_filipino
                : guardian.description}
            </p>
          </div>

          {/* Powers */}
          <div className="rounded-lg p-4 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
            <h2 className="text-xs font-bold text-[var(--luntian-text)] mb-3">
              {isFil ? 'Mga Kapangyarihan' : 'Powers'}
            </h2>
            <div className="space-y-3">
              {[guardian.power_1, guardian.power_2, guardian.power_3].map((power, i) => {
                const info = powers[power]
                return (
                  <div
                    key={i}
                    className="rounded-lg p-3 border"
                    style={{
                      backgroundColor: `${config.color}08`,
                      borderColor: `${config.color}22`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-bold text-sm" style={{ color: config.color }}>
                        {power}
                      </h3>
                      {info && (
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{
                            color: config.color,
                            backgroundColor: `${config.color}15`,
                          }}
                        >
                          {info.type}
                        </span>
                      )}
                    </div>
                    {info && (
                      <p className="text-xs text-[var(--luntian-text-muted)]">
                        {isFil ? info.descFil : info.desc}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Lore */}
          {lore && (
            <div className="rounded-lg p-4 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20">
              <h2 className="text-xs font-bold text-[var(--luntian-text)] mb-2">
                {isFil ? 'Kasaysayan' : 'Lore'}
              </h2>
              <p className="text-xs text-[var(--luntian-text-muted)] leading-relaxed italic">
                {isFil ? lore.fil : lore.en}
              </p>
            </div>
          )}

          {/* Region Connection */}
          {region && (
            <div className="rounded-lg p-3 bg-[var(--luntian-primary)]/5 border border-[var(--luntian-primary)]/20">
              <h3 className="text-[10px] font-semibold text-[var(--luntian-text-muted)] uppercase tracking-wider mb-1">
                {isFil ? 'Rehiyong Tahanan' : 'Home Region'}
              </h3>
              <div className="text-sm font-bold text-[var(--luntian-primary-light)]">
                {isFil && region.name_filipino ? region.name_filipino : region.name}
              </div>
              <div className="text-xs text-[var(--luntian-text-muted)] mt-0.5">
                Saga {region.saga} - {isFil ? 'Kabanata' : 'Chapter'} {region.chapter_number}
              </div>
            </div>
          )}

          {/* Nemesis */}
          {nemesis && (
            <div
              className="rounded-lg p-3 bg-red-950/20 border border-red-900/30 cursor-pointer hover:bg-red-950/30 transition-colors"
              onClick={() => navigate(`/generals/${nemesis.name}`)}
            >
              <h3 className="text-[10px] font-semibold text-red-400/60 uppercase tracking-wider mb-1">
                {isFil ? 'Kaaway' : 'Nemesis'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-400">{nemesis.display_name}</span>
                <span className="text-xs text-red-300/60">{nemesis.threat_display}</span>
                <span className="ml-auto text-[10px] text-red-400/40">View →</span>
              </div>
              <p className="text-xs text-[var(--luntian-text-muted)] mt-1">
                {isFil && nemesis.description_filipino
                  ? nemesis.description_filipino
                  : nemesis.description}
              </p>
            </div>
          )}

          {/* Battle Button */}
          <div className="pt-1 pb-4">
            <button
              onClick={() => navigate('/battle')}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: config.color }}
            >
              {isFil ? `Ipaglaban si ${guardian.display_name}` : `Battle with ${guardian.display_name}`}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Model Portrait */}
        <div className="w-1/2 relative border-l border-[var(--luntian-primary)]/15">
          <Canvas
            camera={{ position: [0, 1.2, 4], fov: 65 }}
            gl={{ antialias: true }}
            style={{ background: '#030a03' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.2} />
                <directionalLight position={[3, 5, 2]} intensity={2} />
                <directionalLight position={[-3, 3, -2]} intensity={1} />
                <pointLight position={[-2, 2, 3]} intensity={1.5} color={config.color} />
                <pointLight position={[2, 1, -2]} intensity={1} color={config.color} />
                <pointLight position={[0, -1, 2]} intensity={0.8} color="#ffffff" />
              <fog attach="fog" args={['#030a03', 5, 14]} />

              {/* Arena floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <circleGeometry args={[1.5, 48]} />
                <meshStandardMaterial color="#050a05" metalness={0.1} roughness={0.9} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
                <ringGeometry args={[1.35, 1.5, 48]} />
                <meshStandardMaterial
                  color={config.color}
                  emissive={config.color}
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.5}
                />
              </mesh>

              <GuardianModelLookup
                name={guardian.name}
                animPhase="idle"
                hp={100}
                role="guardian"
                baseX={0}
              />
              <OrbitControls
                enablePan={false}
                autoRotate
                autoRotateSpeed={1}
                enableZoom={false}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2.3}
              />
            </Suspense>
          </Canvas>

          {/* Drag hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[var(--luntian-text-muted)]/30 pointer-events-none">
            Drag to rotate
          </div>

          {/* Side gradient blend */}
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-[var(--luntian-bg)] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

export default GuardianDetailPage