/**
 * ⚔️ LUNTIAN ANGLARO — 3D Battle Arena
 * Themed battlefields per General, smooth performance.
 */

/**
 * ⚔️ LUNTIAN ANGLARO — 3D Battle Arena
 * Themed battlefields per General, smooth performance.
 */
import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ELEMENT_CONFIG } from '@/types/game.types'
import { useBattleLogic } from '@/hooks/useBattleLogic'
import { GuardianModelLookup, GeneralModelLookup } from '@/components/battle3d/GuardianModels'
import type { DamageEvent } from '@/hooks/useBattleLogic'
import type { Guardian, General, GuardianElement } from '@/types/game.types'

/* ═══════════════════════════════════════════════
   ARENA THEMES — unique battlefield per General
   ═══════════════════════════════════════════════ */
const ARENA_THEMES: Record<string, {
  floor: string; ring: string; fog: string
  light1: string; light2: string; grid: string
}> = {
  usok:     { floor: '#1a1a1a', ring: '#78909C', fog: '#0a0808', light1: '#FF6D00', light2: '#78909C', grid: '#78909C' },
  mantsa:   { floor: '#0a0a1a', ring: '#7B1FA2', fog: '#050510', light1: '#7B1FA2', light2: '#00E676', grid: '#7B1FA2' },
  hukay:    { floor: '#1a0e05', ring: '#FF6D00', fog: '#0a0503', light1: '#FF6D00', light2: '#FF3D00', grid: '#FF6D00' },
  putol:    { floor: '#0a0e05', ring: '#FF8F00', fog: '#050803', light1: '#FF8F00', light2: '#4E342E', grid: '#FF8F00' },
  lason:    { floor: '#050a0a', ring: '#00897B', fog: '#030808', light1: '#00BCD4', light2: '#76FF03', grid: '#00897B' },
  ang_dumi: { floor: '#0a050a', ring: '#D50000', fog: '#080308', light1: '#D50000', light2: '#7B1FA2', grid: '#D50000' },
}

const DEFAULT_THEME = { floor: '#0d1a0d', ring: '#2E7D32', fog: '#050a05', light1: '#4CAF50', light2: '#EF5350', grid: '#2E7D32' }

/* ═══════════════════════════════════════════════
   BATTLE SOUND ENGINE (Web Audio API)
   ═══════════════════════════════════════════════ */
class BattleAudio {
  private ctx: AudioContext | null = null
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    return this.ctx
  }

  attack() {
    try {
      const c = this.getCtx()
      const o = c.createOscillator(), g = c.createGain()
      o.connect(g); g.connect(c.destination)
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(400, c.currentTime)
      o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.3)
      g.gain.setValueAtTime(0.4, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
      o.start(c.currentTime); o.stop(c.currentTime + 0.35)
      // Impact boom
      const o2 = c.createOscillator(), g2 = c.createGain()
      o2.connect(g2); g2.connect(c.destination)
      o2.type = 'square'; o2.frequency.value = 60
      g2.gain.setValueAtTime(0.5, c.currentTime + 0.25)
      g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6)
      o2.start(c.currentTime + 0.25); o2.stop(c.currentTime + 0.6)
    } catch {}
  }

  hit() {
    try {
      const c = this.getCtx()
      const o = c.createOscillator(), g = c.createGain()
      o.connect(g); g.connect(c.destination)
      o.type = 'sine'
      o.frequency.setValueAtTime(500, c.currentTime)
      o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.2)
      g.gain.setValueAtTime(0.5, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
      o.start(c.currentTime); o.stop(c.currentTime + 0.2)
    } catch {}
  }

  critical() {
    try {
      const c = this.getCtx()
      ;[600, 900, 1200].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain()
        o.connect(g); g.connect(c.destination)
        o.type = 'triangle'; o.frequency.value = f
        const t = c.currentTime + i * 0.06
        g.gain.setValueAtTime(0.35, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
        o.start(t); o.stop(t + 0.25)
      })
    } catch {}
  }

  victory() {
    try {
      const c = this.getCtx()
      ;[523, 659, 784, 1047, 1319].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain()
        o.connect(g); g.connect(c.destination)
        o.type = 'triangle'; o.frequency.value = f
        const t = c.currentTime + i * 0.15
        g.gain.setValueAtTime(0.3, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
        o.start(t); o.stop(t + 0.7)
      })
    } catch {}
  }

  defeat() {
    try {
      const c = this.getCtx()
      ;[400, 300, 200, 80].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain()
        o.connect(g); g.connect(c.destination)
        o.type = 'sawtooth'; o.frequency.value = f
        const t = c.currentTime + i * 0.2
        g.gain.setValueAtTime(0.2, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
        o.start(t); o.stop(t + 0.5)
      })
    } catch {}
  }

  buttonClick() {
    try {
      const c = this.getCtx()
      const o = c.createOscillator(), g = c.createGain()
      o.connect(g); g.connect(c.destination)
      o.type = 'sine'; o.frequency.value = 600
      g.gain.setValueAtTime(0.15, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1)
      o.start(c.currentTime); o.stop(c.currentTime + 0.1)
    } catch {}
  }
}

const battleAudio = new BattleAudio()

/* ── Attack Projectile ───────────────────────── */
function AttackProjectile({ from, to, color, onDone }: {
  from: [number, number, number]; to: [number, number, number]; color: string; onDone: () => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const progress = useRef(0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (!ref.current || done.current) return
    progress.current = Math.min(1, progress.current + delta * 2.8)
    const p = progress.current
    ref.current.position.x = THREE.MathUtils.lerp(from[0], to[0], p)
    ref.current.position.y = THREE.MathUtils.lerp(from[1], to[1], p) + Math.sin(p * Math.PI) * 1.8
    ref.current.position.z = THREE.MathUtils.lerp(from[2], to[2], p)
    ref.current.scale.setScalar(0.8 + Math.sin(p * Math.PI) * 0.6)
    if (p >= 1 && !done.current) { done.current = true; onDone() }
  })

  return (
    <mesh ref={ref} position={from}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.9} />
    </mesh>
  )
}

/* ── Floating Damage Popup ───────────────────── */
function DamagePopup({ position, amount, isCrit, onDone }: {
  position: [number, number, number]; amount: number; isCrit: boolean; onDone: () => void
}) {
  const [offsetY, setOffsetY] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const started = useRef(Date.now())

  useFrame(() => {
    const elapsed = (Date.now() - started.current) / 1000
    setOffsetY(elapsed * 1.5)
    setOpacity(Math.max(0, 1 - elapsed / 1.5))
    if (elapsed > 1.5) onDone()
  })

  return (
    <Html position={[position[0], position[1] + 1.8 + offsetY, position[2]]} center style={{ pointerEvents: 'none' }}>
      <div style={{
        color: isCrit ? '#FFD600' : '#EF5350',
        fontSize: isCrit ? '28px' : '22px',
        fontWeight: 900, fontFamily: 'monospace', opacity,
        textShadow: `0 0 12px ${isCrit ? '#FFD600' : '#EF5350'}`,
        whiteSpace: 'nowrap',
      }}>
        -{amount}
        {isCrit && <span style={{ fontSize: '14px', display: 'block' }}>CRITICAL!</span>}
      </div>
    </Html>
  )
}

/* ── Ambient Fireflies ───────────────────────── */
function Fireflies({ color = '#4CAF50' }: { color?: string }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 30
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = Math.random() * 4 + 0.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [])
  useFrame((state) => { if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

/* ═══════════════════════════════════════════════
   SCENE CONTENT
   ═══════════════════════════════════════════════ */
function SceneContent({
  guardianName, generalName, guardianElement, animPhase,
  guardianHP, generalHP, damageEvents, removeDamageEvent,
}: {
  guardianName: string; generalName: string; guardianElement: GuardianElement
  animPhase: string; guardianHP: number; generalHP: number
  damageEvents: DamageEvent[]; removeDamageEvent: (id: number) => void
}) {
  const gConf = ELEMENT_CONFIG[guardianElement]
  const theme = ARENA_THEMES[generalName] || DEFAULT_THEME

  const [projectile, setProjectile] = useState<{
    from: [number, number, number]; to: [number, number, number]; color: string
  } | null>(null)
  const prevPhase = useRef(animPhase)

  useEffect(() => {
    if (animPhase !== prevPhase.current) {
      if (animPhase === 'player_attacking')
        setProjectile({ from: [-2.5, 1.2, 0], to: [2.5, 1.2, 0], color: gConf.color })
      else if (animPhase === 'enemy_attacking')
        setProjectile({ from: [2.5, 1.2, 0], to: [-2.5, 1.2, 0], color: theme.light1 })
      prevPhase.current = animPhase
    }
  }, [animPhase, gConf.color, theme.light1])

  return (
    <>
      {/* Themed Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 3]} intensity={1.8} castShadow shadow-mapSize={1024} />
      <pointLight position={[-3, 3, 1]} intensity={1.2} color={theme.light1} />
      <pointLight position={[3, 3, 1]} intensity={1.2} color={theme.light2} />
      <pointLight position={[0, 1, 4]} intensity={0.5} color="#ffffff" />

      {/* Themed Fog */}
      <fog attach="fog" args={[theme.fog, 8, 20]} />

      {/* Themed Arena Floor */}
      {/* ═══ THEMED TERRAIN ═══ */}
      <group>
        {/* Main ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <circleGeometry args={[6, 64]} />
          <meshStandardMaterial color={theme.floor} metalness={0.15} roughness={0.85} />
        </mesh>

        {/* Outer glow ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[4.5, 5.2, 64]} />
          <meshStandardMaterial color={theme.ring} emissive={theme.ring} emissiveIntensity={1.5} transparent opacity={0.5} />
        </mesh>

        {/* Inner glow ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[3.2, 3.6, 64]} />
          <meshStandardMaterial color={theme.light1} emissive={theme.light1} emissiveIntensity={0.8} transparent opacity={0.3} />
        </mesh>

        {/* Grid */}
        <gridHelper args={[12, 24, `${theme.grid}20`, `${theme.grid}10`]} position={[0, 0.02, 0]} />

        {/* ── TERRAIN PILLARS — themed per General ── */}
        {/* Back-left pillar */}
        <mesh position={[-4, 0.8, -3]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 1.6, 6]} />
          <meshStandardMaterial color={theme.ring} emissive={theme.light1} emissiveIntensity={0.4} flatShading />
        </mesh>
        <mesh position={[-4, 1.7, -3]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={theme.light1} emissive={theme.light1} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>

        {/* Back-right pillar */}
        <mesh position={[4, 0.8, -3]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 1.6, 6]} />
          <meshStandardMaterial color={theme.ring} emissive={theme.light2} emissiveIntensity={0.4} flatShading />
        </mesh>
        <mesh position={[4, 1.7, -3]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={theme.light2} emissive={theme.light2} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>

        {/* Side pillars */}
        <mesh position={[-5, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.2, 1, 5]} />
          <meshStandardMaterial color={theme.floor} emissive={theme.light1} emissiveIntensity={0.3} flatShading />
        </mesh>
        <mesh position={[5, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.2, 1, 5]} />
          <meshStandardMaterial color={theme.floor} emissive={theme.light2} emissiveIntensity={0.3} flatShading />
        </mesh>

        {/* Floating rocks/debris around the arena */}
        {[[-3, 0.3, 2], [3.5, 0.2, 1.5], [-2, 0.15, -2.5], [2.5, 0.25, -1.5], [0, 0.1, 3]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.random(), Math.random(), 0]}>
            <dodecahedronGeometry args={[0.12 + Math.random() * 0.1, 0]} />
            <meshStandardMaterial color={theme.ring} emissive={theme.light1} emissiveIntensity={0.2} flatShading transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Themed Fireflies */}
      <Fireflies color={theme.ring} />

      {/* Guardian (left) */}
      <GuardianModelLookup
        name={guardianName}
        animPhase={animPhase as any}
        hp={guardianHP}
        role="guardian"
        baseX={-2.5}
      />

      {/* General (right) */}
      <GeneralModelLookup
        name={generalName}
        animPhase={animPhase as any}
        hp={generalHP}
        role="general"
        baseX={2.5}
      />

      {/* Projectile */}
      {projectile && (
        <AttackProjectile
          from={projectile.from} to={projectile.to} color={projectile.color}
          onDone={() => setProjectile(null)}
        />
      )}

      {/* Damage Popups */}
      {damageEvents.map((evt) => (
        <DamagePopup
          key={evt.id}
          position={evt.target === 'general' ? [2.5, 1.5, 0] : [-2.5, 1.5, 0]}
          amount={evt.amount} isCrit={evt.isCrit}
          onDone={() => removeDamageEvent(evt.id)}
        />
      ))}

      {/* Camera */}
      <OrbitControls
        enablePan={false} minDistance={6} maxDistance={14}
        minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5}
        autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.05}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════
   EXPORTED COMPONENT
   ═══════════════════════════════════════════════ */
interface Battle3DArenaProps {
  guardian: Guardian
  general: General
  language: 'en' | 'fil'
  onBattleEnd: (won: boolean, stats: { damageDealt: number; damageTaken: number; turnsPlayed: number }) => void
  onExit: () => void
}

export default function Battle3DArena({ guardian, general, language, onBattleEnd, onExit }: Battle3DArenaProps) {
  const {
    guardianHP, generalHP, turn, isPlayerTurn, battleOver, winner,
    animPhase, battleLog, damageEvents, stats, effectiveness,
    playerAttack, removeDamageEvent,
  } = useBattleLogic(guardian, general, language)

  const gConf = ELEMENT_CONFIG[guardian.element]
  const theme = ARENA_THEMES[general.name] || DEFAULT_THEME

  useEffect(() => {
    if (battleOver && winner) {
      if (winner === 'guardian') battleAudio.victory()
      else battleAudio.defeat()
      onBattleEnd(winner === 'guardian', stats)
    }
  }, [battleOver, winner])

  const hpColor = (hp: number) => (hp > 60 ? '#4CAF50' : hp > 30 ? '#FFD600' : '#EF5350')

  return (
    <div className="max-w-5xl mx-auto">
      {/* Turn Header */}
      <div className="text-center mb-3">
        <span className="text-xs text-[var(--luntian-text-muted)] uppercase tracking-widest">
          {language === 'en' ? 'Turn' : 'Turno'} {turn}
        </span>
        {effectiveness > 1 && <div className="text-xs text-green-400">Element Advantage!</div>}
        {effectiveness < 1 && <div className="text-xs text-red-400">Element Disadvantage</div>}
      </div>

      {/* 3D Viewport */}
      <div className="w-full h-[420px] rounded-2xl overflow-hidden border mb-4 relative"
        style={{
            borderColor: `${theme.ring}60`,
            background: `radial-gradient(ellipse at center, ${theme.fog} 0%, ${theme.floor} 60%, #000000 100%)`,
            boxShadow: `inset 0 0 60px ${theme.ring}15, 0 0 20px ${theme.ring}10`,
        }}>
        <Canvas camera={{ position: [0, 4, 8], fov: 42 }} shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <SceneContent
              guardianName={guardian.name}
              generalName={general.name}
              guardianElement={guardian.element}
              animPhase={animPhase}
              guardianHP={guardianHP}
              generalHP={generalHP}
              damageEvents={damageEvents}
              removeDamageEvent={removeDamageEvent}
            />
          </Suspense>
        </Canvas>

        {/* Overlay Labels */}
        <div className="absolute top-3 left-4 text-xs">
          <span className="font-bold" style={{ color: gConf.color }}>{guardian.display_name}</span>
          <span className="text-[var(--luntian-text-muted)] ml-1">{guardian.element_display}</span>
        </div>
        <div className="absolute top-3 right-4 text-xs text-right">
          <span className="font-bold" style={{ color: theme.ring }}>{general.display_name}</span>
          <span className="text-[var(--luntian-text-muted)] ml-1">{general.threat_display}</span>
        </div>
      </div>

      {/* HP Bars */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-3 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/15">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold" style={{ color: gConf.color }}>{guardian.display_name}</span>
            <span style={{ color: hpColor(guardianHP) }}>{guardianHP}/100</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-3">
            <div className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${guardianHP}%`, backgroundColor: hpColor(guardianHP) }} />
          </div>
        </div>
        <div className="rounded-xl p-3 bg-[var(--luntian-surface)] border" style={{ borderColor: `${theme.ring}20` }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold" style={{ color: theme.ring }}>{general.display_name}</span>
            <span style={{ color: hpColor(generalHP) }}>{generalHP}/100</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-3">
            <div className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${generalHP}%`, backgroundColor: hpColor(generalHP) }} />
          </div>
        </div>
      </div>

      {/* Victory / Defeat */}
      {battleOver && (
        <div className="rounded-2xl p-8 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20 text-center mb-4">
          <div className="text-5xl mb-3">{winner === 'guardian' ? '🏆' : '💀'}</div>
          <h2 className="text-3xl font-black mb-2"
            style={{ color: winner === 'guardian' ? '#4CAF50' : '#EF5350' }}>
            {winner === 'guardian' ? (language === 'en' ? 'VICTORY!' : 'TAGUMPAY!') : (language === 'en' ? 'DEFEATED...' : 'NATALO...')}
          </h2>
          <p className="text-[var(--luntian-text-muted)] mb-5 text-sm">
            {winner === 'guardian'
              ? `${general.display_name} has been defeated! The environment heals.`
              : 'The pollution grows stronger... Try again, Guardian.'}
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--luntian-primary-light)]">{stats.damageDealt}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">Damage Dealt</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-400">{stats.damageTaken}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">Damage Taken</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--luntian-gold)]">{stats.turnsPlayed}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)]">Turns</div>
            </div>
          </div>
          <button onClick={onExit}
            className="px-8 py-2.5 rounded-lg bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold transition-all">
            {language === 'en' ? 'Continue' : 'Magpatuloy'}
          </button>
        </div>
      )}

      {/* Attack Buttons */}
      {!battleOver && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[guardian.power_1, guardian.power_2, guardian.power_3].map((power, i) => (
            <button
              key={i}
              onClick={() => { battleAudio.buttonClick(); playerAttack(power, i) }}
              disabled={!isPlayerTurn}
              className="p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isPlayerTurn ? `${gConf.color}18` : '#1a1a1a',
                borderColor: isPlayerTurn ? `${gConf.color}55` : '#333',
              }}
            >
              <div className="font-bold text-sm" style={{ color: isPlayerTurn ? gConf.color : '#555' }}>{power}</div>
              <div className="text-[10px] text-[var(--luntian-text-muted)] mt-0.5">
                {['Normal', 'Strong', 'Ultimate'][i]} x{[1.0, 1.2, 1.5][i]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Waiting */}
      {!battleOver && !isPlayerTurn && (
        <div className="text-center mb-4 animate-pulse">
          <span className="text-sm" style={{ color: theme.ring }}>
            {general.display_name} {language === 'en' ? 'is attacking...' : 'umaatake...'}
          </span>
        </div>
      )}

      {/* Battle Log */}
      <div className="rounded-xl border border-[var(--luntian-primary)]/15 bg-[var(--luntian-surface)] max-h-44 overflow-y-auto">
        <div className="px-4 py-2 border-b border-[var(--luntian-primary)]/10 sticky top-0 bg-[var(--luntian-surface)] z-10">
          <span className="text-xs font-semibold text-[var(--luntian-text-muted)]">Battle Log</span>
        </div>
        <div className="p-3 space-y-1">
          {battleLog.length === 0 ? (
            <p className="text-xs text-[var(--luntian-text-muted)]/40 text-center py-4">Choose your attack!</p>
          ) : (
            battleLog.map((log, i) => (
              <div key={i} className={`text-xs px-2 py-1 rounded ${log.actor === 'guardian' ? 'text-[var(--luntian-primary-light)]' : 'text-red-400'}`}>
                <span className="text-[var(--luntian-text-muted)]/40 mr-2">T{log.turn}</span>
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}