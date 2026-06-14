/**
 * ⚔️ LUNTIAN ANGLARO — 3D Battle Arena
 * React Three Fiber + Drei powered battle scene
 * with procedural models, attack projectiles, and damage popups.
 */
import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { ELEMENT_CONFIG } from '@/types/game.types'
import { useBattleLogic } from '@/hooks/useBattleLogic'
import type { AnimPhase, DamageEvent } from '@/hooks/useBattleLogic'
import type { Guardian, General, GuardianElement } from '@/types/game.types'
import { toast } from 'sonner'
import { GuardianModelLookup, GeneralModelLookup } from './GuardianModels'

/* ══════════════════════════════════════════════
   3D CONFIG
   ══════════════════════════════════════════════ */

const ELEMENT_GEO: Record<GuardianElement, {
  type: 'ico' | 'sphere' | 'dodeca' | 'octa' | 'torus'
  color: string
  emissive: string
}> = {
  NATURE: { type: 'ico',    color: '#4CAF50', emissive: '#2E7D32' },
  WATER:  { type: 'sphere', color: '#2196F3', emissive: '#1565C0' },
  EARTH:  { type: 'dodeca', color: '#FF5722', emissive: '#BF360C' },
  WIND:   { type: 'octa',   color: '#9C27B0', emissive: '#4A148C' },
  MARINE: { type: 'torus',  color: '#00BCD4', emissive: '#006064' },
}

/* ── Arena Floor ──────────────────────────────── */

function ArenaFloor() {
  return (
    <group>
      {/* Main platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#0d1a0d" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Glowing edge ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4.8, 5.1, 64]} />
        <meshStandardMaterial
          color="#2E7D32"
          emissive="#2E7D32"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Grid helper */}
      <gridHelper args={[10, 20, '#2E7D3218', '#2E7D3210']} position={[0, 0.01, 0]} />
    </group>
  )
}

/* ── Creature Model ──────────────────────────── */

function CreatureModel({
  position,
  geoType,
  color,
  emissive,
  hp,
  animPhase,
  role,
}: {
  position: [number, number, number]
  geoType: string
  color: string
  emissive: string
  hp: number
  animPhase: AnimPhase
  role: 'guardian' | 'general'
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.MeshStandardMaterial>(null!)
  const flashRef = useRef(0)
  const baseX = position[0]

  // Track hit phases to trigger flash
  const prevPhase = useRef(animPhase)
  useEffect(() => {
    const isMyHit =
      (role === 'general' && animPhase === 'player_hit') ||
      (role === 'guardian' && animPhase === 'enemy_hit')
    if (isMyHit && prevPhase.current !== animPhase) {
      flashRef.current = 1.0
    }
    prevPhase.current = animPhase
  }, [animPhase, role])

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return
    const t = state.clock.elapsedTime

    // ── Bob + Rotate ──
    meshRef.current.position.y = position[1] + Math.sin(t * 2) * 0.12
    meshRef.current.rotation.y += delta * (role === 'general' ? -0.4 : 0.4)

    // ── Lunge animation ──
    const isAttacking =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')

    const targetX = isAttacking
      ? baseX + (role === 'guardian' ? 1.5 : -1.5)
      : baseX

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      0.12,
    )

    // ── Hit flash decay ──
    if (flashRef.current > 0) {
      flashRef.current = Math.max(0, flashRef.current - delta * 4)
    }
    matRef.current.emissiveIntensity = 0.4 + flashRef.current * 3

    // ── Death fade ──
    matRef.current.opacity = hp > 0 ? 1 : 0.2

    // ── Pulse scale when attacking ──
    const pulseScale = isAttacking ? 1.15 + Math.sin(t * 12) * 0.05 : 1.0
    meshRef.current.scale.setScalar(pulseScale)
  })

  const geo = useMemo(() => {
    switch (geoType) {
      case 'ico':    return <icosahedronGeometry args={[0.8, 1]} />
      case 'sphere': return <sphereGeometry args={[0.8, 32, 32]} />
      case 'dodeca': return <dodecahedronGeometry args={[0.8, 0]} />
      case 'octa':   return <octahedronGeometry args={[0.8, 0]} />
      case 'torus':  return <torusGeometry args={[0.6, 0.28, 16, 32]} />
      default:       return <octahedronGeometry args={[0.9, 0]} />
    }
  }, [geoType])

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {geo}
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.4}
        metalness={0.25}
        roughness={0.6}
        transparent
      />
    </mesh>
  )
}

/* ── Attack Projectile ───────────────────────── */

function AttackProjectile({
  from,
  to,
  color,
  onDone,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  onDone: () => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const progress = useRef(0)
  const done = useRef(false)

  useFrame((_, delta) => {
    if (!ref.current || done.current) return
    progress.current = Math.min(1, progress.current + delta * 2.8)
    const p = progress.current

    ref.current.position.x = THREE.MathUtils.lerp(from[0], to[0], p)
    ref.current.position.y =
      THREE.MathUtils.lerp(from[1], to[1], p) +
      Math.sin(p * Math.PI) * 1.8 // arc
    ref.current.position.z = THREE.MathUtils.lerp(from[2], to[2], p)
    ref.current.scale.setScalar(0.8 + Math.sin(p * Math.PI) * 0.6)

    if (p >= 1 && !done.current) {
      done.current = true
      onDone()
    }
  })

  return (
    <mesh ref={ref} position={from}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ── Floating Damage Popup ───────────────────── */

function DamagePopup({
  position,
  amount,
  isCrit,
  onDone,
}: {
  position: [number, number, number]
  amount: number
  isCrit: boolean
  onDone: () => void
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
    <Html
      position={[position[0], position[1] + 1.8 + offsetY, position[2]]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          color: isCrit ? '#FFD600' : '#EF5350',
          fontSize: isCrit ? '28px' : '22px',
          fontWeight: 900,
          fontFamily: 'monospace',
          opacity,
          textShadow: `0 0 12px ${isCrit ? '#FFD600' : '#EF5350'}`,
          whiteSpace: 'nowrap',
        }}
      >
        -{amount}
        {isCrit && <span style={{ fontSize: '14px', display: 'block' }}>CRITICAL!</span>}
      </div>
    </Html>
  )
}

/* ── Ambient Fireflies ───────────────────────── */

function Fireflies() {
  const ref = useRef<THREE.Points>(null!)
  const count = 40

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = Math.random() * 4 + 0.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#4CAF50" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

/* ══════════════════════════════════════════════
   SCENE CONTENT  (lives inside <Canvas>)
   ══════════════════════════════════════════════ */

function SceneContent({
  guardianElement,
  guardianName,
  generalName,
  animPhase,
  guardianHP,
  generalHP,
  damageEvents,
  removeDamageEvent,
}: {
  guardianElement: GuardianElement
  guardianName: string
  generalName: string
  animPhase: AnimPhase
  guardianHP: number
  generalHP: number
  damageEvents: DamageEvent[]
  removeDamageEvent: (id: number) => void
}) {
  const gConf = ELEMENT_GEO[guardianElement]
  const [projectile, setProjectile] = useState<{
    from: [number, number, number]
    to: [number, number, number]
    color: string
  } | null>(null)

  const prevPhase = useRef(animPhase)

  useEffect(() => {
    if (animPhase !== prevPhase.current) {
      if (animPhase === 'player_attacking') {
        setProjectile({ from: [-2.5, 1, 0], to: [2.5, 1, 0], color: gConf.color })
      } else if (animPhase === 'enemy_attacking') {
        setProjectile({ from: [2.5, 1, 0], to: [-2.5, 1, 0], color: '#EF5350' })
      }
      prevPhase.current = animPhase
    }
  }, [animPhase, gConf.color])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 3]} intensity={1.8} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-3, 4, -2]} intensity={0.8} />
        <pointLight position={[-3, 3, 1]} intensity={1.2} color={gConf.color} />
        <pointLight position={[3, 3, 1]} intensity={1.2} color="#EF5350" />
        <pointLight position={[0, 1, 4]} intensity={0.6} color="#ffffff" />

      {/* Arena */}
      <ArenaFloor />
      <Fireflies />

      {/* Guardian (left) — procedural model */}
      <GuardianModelLookup
        name={guardianName}
        animPhase={animPhase}
        hp={guardianHP}
        role="guardian"
        baseX={-2.5}
      />

      {/* General (right) — procedural model */}
      <GeneralModelLookup
        name={generalName}
        animPhase={animPhase}
        hp={generalHP}
        role="general"
        baseX={2.5}
      />

      {/* Attack Projectile */}
      {projectile && (
        <AttackProjectile
          from={projectile.from}
          to={projectile.to}
          color={projectile.color}
          onDone={() => setProjectile(null)}
        />
      )}

      {/* Floating Damage Numbers */}
      {damageEvents.map((evt) => (
        <DamagePopup
          key={evt.id}
          position={evt.target === 'general' ? [2.5, 1, 0] : [-2.5, 1, 0]}
          amount={evt.amount}
          isCrit={evt.isCrit}
          onDone={() => removeDamageEvent(evt.id)}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

/* ══════════════════════════════════════════════
   EXPORTED COMPONENT
   ══════════════════════════════════════════════ */

interface Battle3DArenaProps {
  guardian: Guardian
  general: General
  language: 'en' | 'fil'
  onBattleEnd: (won: boolean, stats: { damageDealt: number; damageTaken: number; turnsPlayed: number }) => void
  onExit: () => void
}

export default function Battle3DArena({
  guardian,
  general,
  language,
  onBattleEnd,
  onExit,
}: Battle3DArenaProps) {
  const {
    guardianHP,
    generalHP,
    turn,
    isPlayerTurn,
    battleOver,
    winner,
    animPhase,
    battleLog,
    damageEvents,
    stats,
    effectiveness,
    playerAttack,
    removeDamageEvent,
  } = useBattleLogic(guardian, general, language)

  const gConf = ELEMENT_CONFIG[guardian.element]

  // Notify parent on battle end
  useEffect(() => {
    if (battleOver && winner) {
      onBattleEnd(winner === 'guardian', stats)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleOver, winner])

  const hpColor = (hp: number) => (hp > 60 ? '#4CAF50' : hp > 30 ? '#FFD600' : '#EF5350')

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Turn Header ── */}
      <div className="text-center mb-3">
        <span className="text-xs text-[var(--luntian-text-muted)] uppercase tracking-widest">
          {language === 'en' ? 'Turn' : 'Turno'} {turn}
        </span>
        {effectiveness > 1 && (
          <div className="text-xs text-green-400">⚡ {language === 'en' ? 'Element Advantage!' : 'Bentahe ng Elemento!'}</div>
        )}
        {effectiveness < 1 && (
          <div className="text-xs text-red-400">⚠️ {language === 'en' ? 'Element Disadvantage' : 'Disbentahe ng Elemento'}</div>
        )}
      </div>

      {/* ═══ 3D VIEWPORT ═══ */}
      <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-[var(--luntian-primary)]/25 bg-[#050a05] mb-4 relative">
        <Canvas
          camera={{ position: [0, 5, 9], fov: 40 }}
          shadows
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={['#050a05', 8, 20]} />
            <SceneContent
                guardianElement={guardian.element}
                guardianName={guardian.name}
                generalName={general.name}
                animPhase={animPhase}
                guardianHP={guardianHP}
                generalHP={generalHP}
                damageEvents={damageEvents}
                removeDamageEvent={removeDamageEvent}
                />
          </Suspense>
        </Canvas>

        {/* 3D Overlay Labels */}
        <div className="absolute top-3 left-4 text-xs">
          <span className="font-bold" style={{ color: gConf.color }}>{guardian.display_name}</span>
          <span className="text-[var(--luntian-text-muted)] ml-1">{guardian.element_display}</span>
        </div>
        <div className="absolute top-3 right-4 text-xs text-right">
          <span className="font-bold text-red-400">{general.display_name}</span>
          <span className="text-red-300/60 ml-1">{general.threat_display}</span>
        </div>
      </div>

      {/* ── HP Bars ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Guardian HP */}
        <div className="rounded-xl p-3 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/15">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold" style={{ color: gConf.color }}>🛡️ {guardian.display_name}</span>
            <span style={{ color: hpColor(guardianHP) }}>{guardianHP}/100</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${guardianHP}%`, backgroundColor: hpColor(guardianHP), boxShadow: `0 0 8px ${hpColor(guardianHP)}44` }}
            />
          </div>
        </div>
        {/* General HP */}
        <div className="rounded-xl p-3 bg-[var(--luntian-surface)] border border-red-900/20">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-red-400">💀 {general.display_name}</span>
            <span style={{ color: hpColor(generalHP) }}>{generalHP}/100</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${generalHP}%`, backgroundColor: hpColor(generalHP), boxShadow: `0 0 8px ${hpColor(generalHP)}44` }}
            />
          </div>
        </div>
      </div>

      {/* ── Victory / Defeat Overlay ── */}
      {battleOver && (
        <div className="rounded-2xl p-8 bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/20 text-center mb-4">
          <div className="text-5xl mb-3">{winner === 'guardian' ? '🏆' : '💀'}</div>
          <h2
            className="text-3xl font-black mb-2"
            style={{ color: winner === 'guardian' ? '#4CAF50' : '#EF5350' }}
          >
            {winner === 'guardian'
              ? language === 'en' ? 'VICTORY!' : 'TAGUMPAY!'
              : language === 'en' ? 'DEFEATED...' : 'NATALO...'}
          </h2>
          <p className="text-[var(--luntian-text-muted)] mb-5 text-sm">
            {winner === 'guardian'
              ? language === 'en'
                ? `${general.display_name} has been defeated! The environment heals.`
                : `Natalo si ${general.display_name}! Gumagaling ang kalikasan.`
              : language === 'en'
                ? 'The pollution grows stronger... Try again, Guardian.'
                : 'Lumakas ang polusyon... Subukan muli, Tagapag-alaga.'}
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
          <button
            onClick={onExit}
            className="px-8 py-2.5 rounded-lg bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold transition-all"
          >
            {language === 'en' ? 'Return to Battle Select' : 'Bumalik sa Pagpili ng Laban'}
          </button>
        </div>
      )}

      {/* ── Attack Buttons ── */}
      {!battleOver && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[guardian.power_1, guardian.power_2, guardian.power_3].map((power, i) => (
            <button
              key={i}
              onClick={() => playerAttack(power, i)}
              disabled={!isPlayerTurn}
              className="p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: isPlayerTurn ? `${gConf.color}18` : '#1a1a1a',
                borderColor: isPlayerTurn ? `${gConf.color}55` : '#333',
              }}
            >
              <div className="font-bold text-sm" style={{ color: isPlayerTurn ? gConf.color : '#555' }}>
                {power}
              </div>
              <div className="text-[10px] text-[var(--luntian-text-muted)] mt-0.5">
                {['Normal', 'Strong', 'Ultimate'][i]} • x{[1.0, 1.2, 1.5][i]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Waiting Indicator ── */}
      {!battleOver && !isPlayerTurn && (
        <div className="text-center mb-4 animate-pulse">
          <span className="text-sm text-red-400">
            💀 {general.display_name} {language === 'en' ? 'is attacking...' : 'umaatake...'}
          </span>
        </div>
      )}

      {/* ── Battle Log ── */}
      <div className="rounded-xl border border-[var(--luntian-primary)]/15 bg-[var(--luntian-surface)] max-h-44 overflow-y-auto">
        <div className="px-4 py-2 border-b border-[var(--luntian-primary)]/10 sticky top-0 bg-[var(--luntian-surface)] z-10">
          <span className="text-xs font-semibold text-[var(--luntian-text-muted)]">
            📜 {language === 'en' ? 'Battle Log' : 'Talaan ng Laban'}
          </span>
        </div>
        <div className="p-3 space-y-1">
          {battleLog.length === 0 ? (
            <p className="text-xs text-[var(--luntian-text-muted)]/40 text-center py-4">
              {language === 'en' ? 'Choose your attack to begin!' : 'Pumili ng atake para magsimula!'}
            </p>
          ) : (
            battleLog.map((log, i) => (
              <div
                key={i}
                className={`text-xs px-2 py-1 rounded ${
                  log.actor === 'guardian' ? 'text-[var(--luntian-primary-light)]' : 'text-red-400'
                }`}
              >
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