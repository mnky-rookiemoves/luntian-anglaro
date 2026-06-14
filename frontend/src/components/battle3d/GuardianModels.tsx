/**
 * 🛡️ LUNTIAN ANGLARO — Procedural 3D Guardian Models
 * Each Guardian built from grouped Three.js primitives
 * matching the concept art references.
 *
 * Luntian  → Leaf fairy sprite with dragonfly wings
 * Alon     → Flowing water spirit with coral staff
 * Bulkan   → Massive rock golem with lava cracks
 * Haribon  → Philippine Eagle with green rune harness
 * Pawikan  → Ancient sea turtle with coral shell
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AnimPhase } from '@/hooks/useBattleLogic'
import { hasGLBModel, GLBModel } from './GLBModelLoader'

interface ModelProps {
  animPhase: AnimPhase
  hp: number
  role: 'guardian' | 'general'
  baseX: number
}

/* ═══════════════════════════════════════════════
   HELPER: Leaf-shaped geometry
   ═══════════════════════════════════════════════ */
function LeafShape({ color, emissive, scale = 1, position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }: {
  color: string; emissive: string; scale?: number
  position?: [number, number, number]; rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[0.22, 6, 4]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.4}
        flatShading
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════
   🌱 LUNTIAN — Leaf Fairy / Nature Sprite
   Concept: Small glowing fairy with overlapping
   green leaf body and translucent dragonfly wings
   ═══════════════════════════════════════════════ */
export function LuntianModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const wingsRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Bob + gentle rotation
    group.current.position.y = 1.0 + Math.sin(t * 2.5) * 0.15
    group.current.rotation.y += delta * 0.6

    // Wing flutter
    if (wingsRef.current) {
      wingsRef.current.children.forEach((wing, i) => {
        const dir = i === 0 ? 1 : -1
        wing.rotation.z = dir * (0.3 + Math.sin(t * 8) * 0.25)
      })
    }

    // Core pulse
    if (coreRef.current) {
      const s = 1.0 + Math.sin(t * 3) * 0.08
      coreRef.current.scale.setScalar(s)
    }

    // Hit flash
    const isMyHit =
      (role === 'guardian' && animPhase === 'enemy_hit') ||
      (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    // Lunge
    const isAttacking =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')
    const tx = isAttacking ? baseX + (role === 'guardian' ? 1.5 : -1.5) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)

    // Death
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 1, 0]} scale={1.3}>
      {/* ── Core glow ── */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#7CFC00"
          emissive="#4CAF50"
          emissiveIntensity={2 + flashRef.current * 3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ── Leaf body — bottom ring (6 leaves, dark green) ── */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <LeafShape
          key={`lb${i}`}
          color="#1B5E20"
          emissive="#2E7D32"
          scale={1.1}
          position={[
            Math.cos(THREE.MathUtils.degToRad(a)) * 0.18,
            -0.15,
            Math.sin(THREE.MathUtils.degToRad(a)) * 0.18,
          ]}
          rotation={[0.4, THREE.MathUtils.degToRad(a), 0]}
        />
      ))}

      {/* ── Middle ring (6 leaves, medium green, offset) ── */}
      {[30, 90, 150, 210, 270, 330].map((a, i) => (
        <LeafShape
          key={`lm${i}`}
          color="#2E7D32"
          emissive="#4CAF50"
          scale={0.95}
          position={[
            Math.cos(THREE.MathUtils.degToRad(a)) * 0.14,
            0.08,
            Math.sin(THREE.MathUtils.degToRad(a)) * 0.14,
          ]}
          rotation={[0.25, THREE.MathUtils.degToRad(a), 0]}
        />
      ))}

      {/* ── Top crown (4 leaves, light green) ── */}
      {[0, 90, 180, 270].map((a, i) => (
        <LeafShape
          key={`lt${i}`}
          color="#4CAF50"
          emissive="#66BB6A"
          scale={0.7}
          position={[
            Math.cos(THREE.MathUtils.degToRad(a)) * 0.08,
            0.28,
            Math.sin(THREE.MathUtils.degToRad(a)) * 0.08,
          ]}
          rotation={[0.1, THREE.MathUtils.degToRad(a), 0]}
        />
      ))}

      {/* ── Tip leaf ── */}
      <LeafShape color="#81C784" emissive="#A5D6A7" scale={0.5} position={[0, 0.42, 0]} />

      {/* ── Dragonfly wings ── */}
      <group ref={wingsRef}>
        {/* Left wing pair */}
        <group position={[-0.05, 0.15, 0]}>
          {/* Upper wing */}
          <mesh position={[-0.28, 0.1, 0]} rotation={[0.1, 0, 0.3]} scale={[0.45, 0.65, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#a8e6cf"
              emissive="#4CAF50"
              emissiveIntensity={0.5}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Lower wing */}
          <mesh position={[-0.25, -0.05, 0]} rotation={[0.1, 0, 0.5]} scale={[0.35, 0.45, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#c8f7dc"
              emissive="#66BB6A"
              emissiveIntensity={0.3}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Right wing pair */}
        <group position={[0.05, 0.15, 0]}>
          <mesh position={[0.28, 0.1, 0]} rotation={[0.1, 0, -0.3]} scale={[0.45, 0.65, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color="#a8e6cf" emissive="#4CAF50" emissiveIntensity={0.5} transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.25, -0.05, 0]} rotation={[0.1, 0, -0.5]} scale={[0.35, 0.45, 0.01]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color="#c8f7dc" emissive="#66BB6A" emissiveIntensity={0.3} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ── Eyes (tiny glowing dots) ── */}
      <mesh position={[-0.06, 0.05, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#AEFF00" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.06, 0.05, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#AEFF00" emissiveIntensity={3} />
      </mesh>

      {/* ── Aura light ── */}
      <pointLight color="#4CAF50" intensity={1.5} distance={3} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   🌊 ALON — Water Spirit with Coral Staff
   Concept: Flowing humanoid water spirit, coral
   vein patterns, staff with spiral water orb,
   wave base, translucent blue body
   ═══════════════════════════════════════════════ */
export function AlonModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const tendrilsRef = useRef<THREE.Group>(null!)
  const staffOrbRef = useRef<THREE.Mesh>(null!)
  const waveRef = useRef<THREE.Mesh>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Gentle sway
    group.current.position.y = 1.0 + Math.sin(t * 1.5) * 0.1
    group.current.rotation.y = Math.sin(t * 0.5) * 0.15

    // Hair/tendril wave animation
    if (tendrilsRef.current) {
      tendrilsRef.current.children.forEach((child, i) => {
        child.rotation.x = Math.sin(t * 2 + i * 1.2) * 0.3
        child.rotation.z = Math.cos(t * 1.5 + i * 0.8) * 0.2
      })
    }

    // Staff orb pulse
    if (staffOrbRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.15
      staffOrbRef.current.scale.setScalar(s)
    }

    // Wave base rotation
    if (waveRef.current) {
      waveRef.current.rotation.y = t * 1.5
      waveRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1)
    }

    // Hit / lunge / death
    const isMyHit = (role === 'guardian' && animPhase === 'enemy_hit') || (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    const isAttacking = (role === 'guardian' && animPhase === 'player_attacking') || (role === 'general' && animPhase === 'enemy_attacking')
    const tx = isAttacking ? baseX + (role === 'guardian' ? 1.5 : -1.5) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 1, 0]} scale={0.9}>
      {/* ── Head ── */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#64B5F6" emissive="#1565C0" emissiveIntensity={0.6} transparent opacity={0.75} />
      </mesh>

      {/* ── Eyes ── */}
      <mesh position={[-0.07, 0.68, 0.16]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#E1F5FE" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.07, 0.68, 0.16]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#E1F5FE" emissiveIntensity={3} />
      </mesh>

      {/* ── Hair tendrils ── */}
      <group ref={tendrilsRef} position={[0, 0.8, 0]}>
        {[0, 50, 130, 180, 230, 310].map((a, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(THREE.MathUtils.degToRad(a)) * 0.12,
              0.05,
              Math.sin(THREE.MathUtils.degToRad(a)) * 0.12,
            ]}
            rotation={[0.5, THREE.MathUtils.degToRad(a), 0]}
          >
            <cylinderGeometry args={[0.02, 0.01, 0.5, 6]} />
            <meshStandardMaterial color="#42A5F5" emissive="#1E88E5" emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Torso (elongated water body) ── */}
      <mesh position={[0, 0.25, 0]} scale={[1, 1.5, 0.7]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#42A5F5" emissive="#1565C0" emissiveIntensity={0.4} transparent opacity={0.65} />
      </mesh>

      {/* ── Coral veins on torso (emissive lines) ── */}
      {[[-0.08, 0.3, 0.2], [0.1, 0.2, 0.18], [-0.05, 0.15, 0.2], [0.08, 0.35, 0.15]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#FF7043" emissive="#E64A19" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* ── Flowing lower body (wave skirt) ── */}
      <mesh position={[0, -0.15, 0]} scale={[1.2, 0.8, 1.2]}>
        <coneGeometry args={[0.35, 0.6, 8]} />
        <meshStandardMaterial color="#29B6F6" emissive="#0288D1" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>

      {/* ── Staff ── */}
      <group position={[0.35, 0.1, 0]} rotation={[0, 0, -0.15]}>
        {/* Shaft */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.025, 1.2, 8]} />
          <meshStandardMaterial color="#80DEEA" emissive="#00ACC1" emissiveIntensity={0.5} />
        </mesh>
        {/* Spiral orb at top */}
        <mesh ref={staffOrbRef} position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#E1F5FE" emissive="#03A9F4" emissiveIntensity={3} transparent opacity={0.8} />
        </mesh>
        {/* Orb ring */}
        <mesh position={[0, 0.65, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.14, 0.015, 8, 16]} />
          <meshStandardMaterial color="#4FC3F7" emissive="#0288D1" emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ── Wave base ── */}
      <mesh ref={waveRef} position={[0, -0.45, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.06, 8, 24]} />
        <meshStandardMaterial color="#4FC3F7" emissive="#039BE5" emissiveIntensity={1} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[0, 0.5, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 24]} />
        <meshStandardMaterial color="#81D4FA" emissive="#0277BD" emissiveIntensity={0.6} transparent opacity={0.25} />
      </mesh>

      <pointLight color="#2196F3" intensity={1.2} distance={3} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   🌋 BULKAN — Rock Golem with Lava Cracks
   Concept: Massive humanoid stone body, glowing
   orange lava cracks, rocky crown/horns, wide stance
   ═══════════════════════════════════════════════ */
export function BulkanModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const lavaRef = useRef<THREE.Group>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Heavy stomp-like bob
    group.current.position.y = 0.8 + Math.abs(Math.sin(t * 1.2)) * 0.05
    group.current.rotation.y = Math.sin(t * 0.3) * 0.08

    // Lava pulse
    if (lavaRef.current) {
      lavaRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat?.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = 1.5 + Math.sin(t * 2 + i * 0.5) * 1.0
        }
      })
    }

    // Hit / lunge
    const isMyHit = (role === 'guardian' && animPhase === 'enemy_hit') || (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    const isAttacking = (role === 'guardian' && animPhase === 'player_attacking') || (role === 'general' && animPhase === 'enemy_attacking')
    const tx = isAttacking ? baseX + (role === 'guardian' ? 1.5 : -1.5) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.1)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.8, 0]} scale={0.85}>
      {/* ── Head (angular rock) ── */}
      <mesh position={[0, 0.85, 0]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#5D4037" emissive="#3E2723" emissiveIntensity={0.3} flatShading />
      </mesh>

      {/* ── Crown horns ── */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 1.05, 0]} rotation={[0.1, 0, (i - 1) * 0.15]}>
          <coneGeometry args={[0.05, 0.2, 5]} />
          <meshStandardMaterial color="#4E342E" emissive="#BF360C" emissiveIntensity={0.5} flatShading />
        </mesh>
      ))}

      {/* ── Eyes (glowing red) ── */}
      <mesh position={[-0.08, 0.88, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FF3D00" emissive="#FF3D00" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0.08, 0.88, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FF3D00" emissive="#FF3D00" emissiveIntensity={4} />
      </mesh>

      {/* ── Torso (large angular rock) ── */}
      <mesh position={[0, 0.4, 0]} scale={[1.1, 1.3, 0.8]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#4E342E" emissive="#3E2723" emissiveIntensity={0.2} flatShading />
      </mesh>

      {/* ── Lava cracks (emissive wireframe overlay) ── */}
      <group ref={lavaRef}>
        <mesh position={[0, 0.4, 0]} scale={[1.12, 1.32, 0.82]}>
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#FF6D00" emissive="#FF3D00" emissiveIntensity={1.5} wireframe />
        </mesh>
        {/* Chest lava core */}
        <mesh position={[0, 0.45, 0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FF6D00" emissive="#FF3D00" emissiveIntensity={3} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* ── Left arm ── */}
      <group position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 6]} />
          <meshStandardMaterial color="#5D4037" flatShading />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.35, 6]} />
          <meshStandardMaterial color="#4E342E" flatShading />
        </mesh>
        {/* Fist */}
        <mesh position={[0, -0.5, 0]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#3E2723" flatShading />
        </mesh>
      </group>

      {/* ── Right arm ── */}
      <group position={[0.45, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 6]} />
          <meshStandardMaterial color="#5D4037" flatShading />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.35, 6]} />
          <meshStandardMaterial color="#4E342E" flatShading />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#3E2723" flatShading />
        </mesh>
      </group>

      {/* ── Left leg ── */}
      <mesh position={[-0.2, -0.15, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.5, 6]} />
        <meshStandardMaterial color="#4E342E" flatShading />
      </mesh>
      <mesh position={[-0.2, -0.45, 0.05]}>
        <boxGeometry args={[0.2, 0.12, 0.3]} />
        <meshStandardMaterial color="#3E2723" flatShading />
      </mesh>

      {/* ── Right leg ── */}
      <mesh position={[0.2, -0.15, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.5, 6]} />
        <meshStandardMaterial color="#4E342E" flatShading />
      </mesh>
      <mesh position={[0.2, -0.45, 0.05]}>
        <boxGeometry args={[0.2, 0.12, 0.3]} />
        <meshStandardMaterial color="#3E2723" flatShading />
      </mesh>

      {/* ── Lava arm cracks ── */}
      <mesh position={[-0.45, 0.35, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.13, 0.11, 0.7, 6]} />
        <meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={1.2} wireframe />
      </mesh>
      <mesh position={[0.45, 0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.7, 6]} />
        <meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={1.2} wireframe />
      </mesh>

      <pointLight color="#FF6D00" intensity={1.5} distance={4} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   🦅 HARIBON — Philippine Eagle Spirit
   Concept: Majestic eagle with massive spread wings,
   green glowing tribal rune harness, powerful talons
   ═══════════════════════════════════════════════ */
export function HaribonModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const wingsRef = useRef<THREE.Group>(null!)
  const runeRef = useRef<THREE.Mesh>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Hover + gentle sway
    group.current.position.y = 1.2 + Math.sin(t * 1.8) * 0.12
    group.current.rotation.y = Math.sin(t * 0.4) * 0.1

    // Wing flap
    if (wingsRef.current && wingsRef.current.children.length >= 2) {
      const flapAngle = Math.sin(t * 2.5) * 0.25
      wingsRef.current.children[0].rotation.z = 0.1 + flapAngle
      wingsRef.current.children[1].rotation.z = -(0.1 + flapAngle)
    }

    // Rune ring rotation
    if (runeRef.current) {
      runeRef.current.rotation.z = t * 0.8
      const mat = runeRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.8
    }

    // Hit / lunge
    const isMyHit = (role === 'guardian' && animPhase === 'enemy_hit') || (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    const isAttacking = (role === 'guardian' && animPhase === 'player_attacking') || (role === 'general' && animPhase === 'enemy_attacking')
    const tx = isAttacking ? baseX + (role === 'guardian' ? 1.8 : -1.8) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.14)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 1.2, 0]} scale={0.9}>
      {/* ── Head ── */}
      <mesh position={[0, 0.35, 0.15]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#A1887F" emissive="#6D4C41" emissiveIntensity={0.2} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.32, 0.32]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.05, 0.15, 6]} />
        <meshStandardMaterial color="#FFB300" emissive="#FF8F00" emissiveIntensity={0.5} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.06, 0.38, 0.26]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#76FF03" emissive="#4CAF50" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0.06, 0.38, 0.26]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#76FF03" emissive="#4CAF50" emissiveIntensity={4} />
      </mesh>
      {/* Head crest feathers */}
      {[-0.06, 0, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0.5, -0.05]} rotation={[-0.3, 0, (i - 1) * 0.15]}>
          <coneGeometry args={[0.02, 0.15, 4]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
      ))}

      {/* ── Body ── */}
      <mesh position={[0, 0.05, 0]} scale={[0.8, 1.2, 0.6]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#8D6E63" emissive="#5D4037" emissiveIntensity={0.15} />
      </mesh>

      {/* ── Green rune harness ── */}
      <mesh ref={runeRef} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.02, 6, 16]} />
        <meshStandardMaterial color="#4CAF50" emissive="#2E7D32" emissiveIntensity={2} />
      </mesh>
      {/* Chest rune gem */}
      <mesh position={[0, 0.1, 0.22]}>
        <octahedronGeometry args={[0.04, 0]} />
        <meshStandardMaterial color="#76FF03" emissive="#4CAF50" emissiveIntensity={4} />
      </mesh>

      {/* ── Wings ── */}
      <group ref={wingsRef}>
        {/* Left wing */}
        <group position={[-0.25, 0.15, -0.05]}>
          {/* Inner wing */}
          <mesh position={[-0.35, 0.05, 0]} rotation={[0, 0.2, 0.1]} scale={[0.7, 0.15, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#A1887F" emissive="#6D4C41" emissiveIntensity={0.1} flatShading />
          </mesh>
          {/* Outer wing */}
          <mesh position={[-0.75, 0.1, 0]} rotation={[0, 0.3, 0.15]} scale={[0.5, 0.1, 0.35]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8D6E63" flatShading />
          </mesh>
          {/* Wing tip feathers */}
          <mesh position={[-0.95, 0.12, 0]} rotation={[0, 0.3, 0.2]} scale={[0.25, 0.06, 0.3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#795548" flatShading />
          </mesh>
          {/* Green rune on wing */}
          <mesh position={[-0.4, 0.08, 0.01]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshStandardMaterial color="#4CAF50" emissive="#2E7D32" emissiveIntensity={2} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Right wing (mirrored) */}
        <group position={[0.25, 0.15, -0.05]}>
          <mesh position={[0.35, 0.05, 0]} rotation={[0, -0.2, -0.1]} scale={[0.7, 0.15, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#A1887F" emissive="#6D4C41" emissiveIntensity={0.1} flatShading />
          </mesh>
          <mesh position={[0.75, 0.1, 0]} rotation={[0, -0.3, -0.15]} scale={[0.5, 0.1, 0.35]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8D6E63" flatShading />
          </mesh>
          <mesh position={[0.95, 0.12, 0]} rotation={[0, -0.3, -0.2]} scale={[0.25, 0.06, 0.3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#795548" flatShading />
          </mesh>
          <mesh position={[0.4, 0.08, 0.01]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshStandardMaterial color="#4CAF50" emissive="#2E7D32" emissiveIntensity={2} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── Tail ── */}
      <mesh position={[0, -0.05, -0.3]} rotation={[0.4, 0, 0]} scale={[0.3, 0.06, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6D4C41" flatShading />
      </mesh>

      {/* ── Talons ── */}
      {[-0.12, 0.12].map((x, i) => (
        <group key={i} position={[x, -0.3, 0.05]}>
          {[-.04, 0, .04].map((cx, j) => (
            <mesh key={j} position={[cx, -0.05, 0.02]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.015, 0.1, 4]} />
              <meshStandardMaterial color="#455A64" />
            </mesh>
          ))}
        </group>
      ))}

      <pointLight color="#4CAF50" intensity={0.8} distance={3} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   🐢 PAWIKAN — Ancient Sea Turtle with Coral Shell
   Concept: Domed shell with growing coral, golden
   energy ribbons, glowing golden eye, four flippers
   ═══════════════════════════════════════════════ */
export function PawikanModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const flippersRef = useRef<THREE.Group>(null!)
  const coralRef = useRef<THREE.Group>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Swimming motion
    group.current.position.y = 0.9 + Math.sin(t * 1.2) * 0.15
    group.current.rotation.y = Math.sin(t * 0.5) * 0.12
    group.current.rotation.z = Math.sin(t * 0.8) * 0.03

    // Flipper swimming animation
    if (flippersRef.current) {
      const kids = flippersRef.current.children
      if (kids[0]) kids[0].rotation.z = 0.3 + Math.sin(t * 2) * 0.3       // front-left
      if (kids[1]) kids[1].rotation.z = -(0.3 + Math.sin(t * 2) * 0.3)    // front-right
      if (kids[2]) kids[2].rotation.z = 0.2 + Math.sin(t * 2 + 1) * 0.2   // back-left
      if (kids[3]) kids[3].rotation.z = -(0.2 + Math.sin(t * 2 + 1) * 0.2) // back-right
    }

    // Coral glow pulse
    if (coralRef.current) {
      coralRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat?.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = 0.5 + Math.sin(t * 1.5 + i * 0.7) * 0.4
        }
      })
    }

    // Hit / lunge
    const isMyHit = (role === 'guardian' && animPhase === 'enemy_hit') || (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    const isAttacking = (role === 'guardian' && animPhase === 'player_attacking') || (role === 'general' && animPhase === 'enemy_attacking')
    const tx = isAttacking ? baseX + (role === 'guardian' ? 1.5 : -1.5) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.1)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.9, 0]} scale={0.95}>
      {/* ── Shell (dome) ── */}
      <mesh position={[0, 0.15, 0]} scale={[1.2, 0.7, 1]}>
        <sphereGeometry args={[0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5D7B6F" emissive="#37474F" emissiveIntensity={0.2} flatShading />
      </mesh>
      {/* Shell pattern lines */}
      <mesh position={[0, 0.16, 0]} scale={[1.22, 0.72, 1.02]}>
        <sphereGeometry args={[0.4, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FFB74D" emissive="#FF8F00" emissiveIntensity={0.8} wireframe />
      </mesh>

      {/* ── Coral growths on shell ── */}
      <group ref={coralRef}>
        {/* Pink coral branch */}
        <mesh position={[-0.1, 0.35, 0.05]}>
          <coneGeometry args={[0.03, 0.18, 5]} />
          <meshStandardMaterial color="#F48FB1" emissive="#E91E63" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.06, 0.38, 0.08]} rotation={[0.3, 0, 0.2]}>
          <coneGeometry args={[0.02, 0.1, 4]} />
          <meshStandardMaterial color="#F48FB1" emissive="#E91E63" emissiveIntensity={0.6} />
        </mesh>
        {/* Orange coral */}
        <mesh position={[0.12, 0.33, -0.05]}>
          <coneGeometry args={[0.035, 0.15, 5]} />
          <meshStandardMaterial color="#FFB74D" emissive="#FF9800" emissiveIntensity={0.7} />
        </mesh>
        {/* Purple coral */}
        <mesh position={[0, 0.36, -0.12]}>
          <coneGeometry args={[0.025, 0.12, 5]} />
          <meshStandardMaterial color="#CE93D8" emissive="#9C27B0" emissiveIntensity={0.5} />
        </mesh>
        {/* Small mushroom coral */}
        <mesh position={[0.08, 0.3, 0.1]}>
          <sphereGeometry args={[0.04, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFE082" emissive="#FFC107" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.15, 0.3, -0.08]}>
          <sphereGeometry args={[0.035, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#80CBC4" emissive="#009688" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ── Body (underside) ── */}
      <mesh position={[0, 0, 0]} scale={[1, 0.4, 0.9]}>
        <sphereGeometry args={[0.4, 12, 8]} />
        <meshStandardMaterial color="#78909C" emissive="#455A64" emissiveIntensity={0.15} />
      </mesh>

      {/* ── Head ── */}
      <mesh position={[0, 0.05, 0.45]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#78909C" emissive="#546E7A" emissiveIntensity={0.2} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.03, 0.58]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 5]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      {/* Golden glowing eye */}
      <mesh position={[-0.06, 0.09, 0.52]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FFD600" emissive="#FFB300" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.06, 0.09, 0.52]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FFD600" emissive="#FFB300" emissiveIntensity={5} />
      </mesh>

      {/* ── Flippers ── */}
      <group ref={flippersRef}>
        {/* Front-left */}
        <mesh position={[-0.38, -0.02, 0.2]} rotation={[0.1, 0.3, 0.3]} scale={[0.45, 0.08, 0.2]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
        {/* Front-right */}
        <mesh position={[0.38, -0.02, 0.2]} rotation={[0.1, -0.3, -0.3]} scale={[0.45, 0.08, 0.2]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
        {/* Back-left */}
        <mesh position={[-0.3, -0.02, -0.25]} rotation={[0.1, 0.5, 0.2]} scale={[0.3, 0.06, 0.15]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
        {/* Back-right */}
        <mesh position={[0.3, -0.02, -0.25]} rotation={[0.1, -0.5, -0.2]} scale={[0.3, 0.06, 0.15]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
      </group>

      {/* ── Golden energy aura ── */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 8, 24]} />
        <meshStandardMaterial color="#FFD600" emissive="#FF8F00" emissiveIntensity={2} transparent opacity={0.35} />
      </mesh>

      <pointLight color="#FFB300" intensity={1} distance={3} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   💀 GENERAL MODELS — Villains of Pollution
   All 6 Generals with unique procedural models
   ═══════════════════════════════════════════════ */

/* ═══ 💨 USOK — The Smoke General ═══
   Massive dark smoke humanoid with billowing body,
   glowing red eyes, smokestack spines, claw hands */
export function UsokModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const smokeRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.9 + Math.sin(t * 1.5) * 0.08
    group.current.rotation.y += delta * -0.3

    // Smoke body billow
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(t * 2 + i) * 0.002
        child.scale.setScalar(1 + Math.sin(t * 1.5 + i * 0.7) * 0.08)
      })
    }

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.9, 0]} scale={0.85}>
      {/* Torso — layered smoke clouds */}
      <group ref={smokeRef}>
        <mesh position={[0, 0.3, 0]} scale={[1.1, 1.3, 0.9]}>
          <dodecahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial color="#263238" emissive="#37474F" emissiveIntensity={0.3} flatShading transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.12, 0.5, 0.08]} scale={0.9}>
          <dodecahedronGeometry args={[0.25, 1]} />
          <meshStandardMaterial color="#37474F" transparent opacity={0.5} flatShading />
        </mesh>
        <mesh position={[-0.1, 0.15, -0.05]} scale={0.85}>
          <dodecahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color="#455A64" transparent opacity={0.55} flatShading />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 0.75, 0.05]}>
        <dodecahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#263238" emissiveIntensity={0.4} flatShading />
      </mesh>

      {/* Angry red eyes — narrow slits */}
      <mesh position={[-0.08, 0.78, 0.18]} scale={[1.8, 0.5, 1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={6} />
      </mesh>
      <mesh position={[0.08, 0.78, 0.18]} scale={[1.8, 0.5, 1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={6} />
      </mesh>

      {/* Smokestack spines on back */}
      {[[-0.08, 0.85, -0.12], [0.08, 0.9, -0.1], [0, 0.95, -0.14]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[-0.3, 0, (i - 1) * 0.1]}>
          <cylinderGeometry args={[0.03, 0.04, 0.2, 6]} />
          <meshStandardMaterial color="#212121" emissive="#424242" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Massive arms */}
      <group position={[-0.45, 0.35, 0]} rotation={[0, 0, 0.4]}>
        <mesh><cylinderGeometry args={[0.1, 0.08, 0.5, 6]} /><meshStandardMaterial color="#37474F" flatShading transparent opacity={0.65} /></mesh>
        <mesh position={[0, -0.35, 0]}><dodecahedronGeometry args={[0.12, 0]} /><meshStandardMaterial color="#263238" flatShading /></mesh>
        {/* Claw fingers */}
        {[-0.05, 0, 0.05].map((x, i) => (
          <mesh key={i} position={[x, -0.48, 0.02]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.015, 0.1, 4]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
      </group>
      <group position={[0.45, 0.35, 0]} rotation={[0, 0, -0.4]}>
        <mesh><cylinderGeometry args={[0.1, 0.08, 0.5, 6]} /><meshStandardMaterial color="#37474F" flatShading transparent opacity={0.65} /></mesh>
        <mesh position={[0, -0.35, 0]}><dodecahedronGeometry args={[0.12, 0]} /><meshStandardMaterial color="#263238" flatShading /></mesh>
        {[-0.05, 0, 0.05].map((x, i) => (
          <mesh key={i} position={[x, -0.48, 0.02]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.015, 0.1, 4]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
      </group>

      {/* Smoke wisp tendrils at base */}
      {[0, 72, 144, 216, 288].map((a, i) => (
        <mesh key={i} position={[Math.cos(a * Math.PI / 180) * 0.25, -0.2, Math.sin(a * Math.PI / 180) * 0.25]} rotation={[0.3, 0, (i - 2) * 0.12]}>
          <cylinderGeometry args={[0.04, 0.01, 0.45, 5]} />
          <meshStandardMaterial color="#455A64" transparent opacity={0.3} />
        </mesh>
      ))}

      <pointLight color="#FF1744" intensity={0.8} distance={3} />
    </group>
  )
}

/* ═══ 🏭 MANTSA — The Stain General ═══
   Toxic humanoid with iridescent oil-slick body,
   corrupted staff, dripping sludge, dead fish aura */
export function MantsaModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const dripRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.85 + Math.sin(t * 1.2) * 0.06
    group.current.rotation.y = Math.sin(t * 0.4) * 0.1

    // Drip animation
    if (dripRef.current) {
      dripRef.current.children.forEach((child, i) => {
        child.position.y = -0.3 - ((t * 0.5 + i * 0.3) % 0.8)
        const scale = 1 - ((t * 0.5 + i * 0.3) % 0.8)
        child.scale.setScalar(Math.max(0.1, scale * 0.5))
      })
    }

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.85, 0]} scale={0.85}>
      {/* Head with spine crown */}
      <mesh position={[0, 0.75, 0]}>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#1B0A2E" emissive="#4A148C" emissiveIntensity={0.4} flatShading />
      </mesh>
      {/* Crown spines */}
      {[-0.1, -0.03, 0.03, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.93, -0.02]} rotation={[0.1, 0, (i - 1.5) * 0.12]}>
          <coneGeometry args={[0.015, 0.12, 4]} />
          <meshStandardMaterial color="#4A148C" emissive="#7B1FA2" emissiveIntensity={1} />
        </mesh>
      ))}
      {/* Red eyes */}
      <mesh position={[-0.06, 0.78, 0.15]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      <mesh position={[0.06, 0.78, 0.15]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>

      {/* Torso — iridescent toxic body */}
      <mesh position={[0, 0.35, 0]} scale={[0.9, 1.4, 0.65]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#1A237E" emissive="#311B92" emissiveIntensity={0.3} flatShading metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Toxic vein patches */}
      {[[-0.1, 0.4, 0.22], [0.12, 0.3, 0.2], [-0.05, 0.2, 0.22], [0.08, 0.45, 0.18]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color={['#E91E63', '#00E676', '#FF6D00', '#00BCD4'][i]} emissive={['#C2185B', '#00C853', '#E65100', '#0097A7'][i]} emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Arms */}
      <group position={[-0.38, 0.4, 0]} rotation={[0, 0, 0.3]}>
        <mesh><cylinderGeometry args={[0.07, 0.06, 0.45, 6]} /><meshStandardMaterial color="#1A237E" flatShading metalness={0.5} /></mesh>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.06, 0.05, 0.3, 6]} /><meshStandardMaterial color="#0D47A1" flatShading /></mesh>
      </group>
      <group position={[0.38, 0.4, 0]} rotation={[0, 0, -0.3]}>
        <mesh><cylinderGeometry args={[0.07, 0.06, 0.45, 6]} /><meshStandardMaterial color="#1A237E" flatShading metalness={0.5} /></mesh>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.06, 0.05, 0.3, 6]} /><meshStandardMaterial color="#0D47A1" flatShading /></mesh>
      </group>

      {/* Staff */}
      <group position={[-0.5, 0.1, 0.1]} rotation={[0, 0, 0.15]}>
        <mesh><cylinderGeometry args={[0.02, 0.025, 1.1, 6]} /><meshStandardMaterial color="#3E2723" /></mesh>
        <mesh position={[0, 0.6, 0]}><dodecahedronGeometry args={[0.06, 0]} /><meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={3} /></mesh>
      </group>

      {/* Legs dissolving into sludge */}
      <mesh position={[-0.12, -0.1, 0]}><cylinderGeometry args={[0.08, 0.12, 0.4, 6]} /><meshStandardMaterial color="#0D47A1" flatShading transparent opacity={0.7} /></mesh>
      <mesh position={[0.12, -0.1, 0]}><cylinderGeometry args={[0.08, 0.12, 0.4, 6]} /><meshStandardMaterial color="#0D47A1" flatShading transparent opacity={0.7} /></mesh>

      {/* Dripping sludge */}
      <group ref={dripRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[(i - 1.5) * 0.12, -0.3, 0.1]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={2} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Toxic pool at base */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshStandardMaterial color="#1B5E20" emissive="#00E676" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      <pointLight color="#7B1FA2" intensity={0.7} distance={3} />
    </group>
  )
}

/* ═══ ⛏️ HUKAY — The Pit General ═══
   Massive rock/earth golem born from illegal mining,
   lava cracks, rebar/metal spikes, crushing claw hands */
export function HukayModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.75 + Math.abs(Math.sin(t * 1)) * 0.04
    group.current.rotation.y = Math.sin(t * 0.3) * 0.06

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.1)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.75, 0]} scale={0.9}>
      {/* Head — jagged rock */}
      <mesh position={[0, 0.8, 0]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#424242" emissive="#212121" emissiveIntensity={0.2} flatShading />
      </mesh>
      {/* Orange lava eyes */}
      <mesh position={[-0.08, 0.83, 0.16]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={5} /></mesh>
      <mesh position={[0.08, 0.83, 0.16]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={5} /></mesh>
      {/* Jagged teeth */}
      <mesh position={[0, 0.75, 0.18]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.06, 0.05, 5]} /><meshStandardMaterial color="#616161" flatShading /></mesh>

      {/* Massive torso */}
      <mesh position={[0, 0.35, 0]} scale={[1.3, 1.4, 1]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#424242" emissive="#212121" emissiveIntensity={0.15} flatShading />
      </mesh>
      {/* Lava crack wireframe */}
      <mesh position={[0, 0.35, 0]} scale={[1.32, 1.42, 1.02]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={1.8} wireframe />
      </mesh>

      {/* Rebar spikes protruding from body */}
      {[[0.3, 0.5, 0.15], [-0.25, 0.55, -0.1], [0.15, 0.6, -0.2], [-0.1, 0.25, 0.3]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[Math.random(), Math.random(), Math.random()]}>
          <cylinderGeometry args={[0.015, 0.01, 0.2, 4]} />
          <meshStandardMaterial color="#795548" emissive="#4E342E" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Massive crushing arms */}
      <group position={[-0.55, 0.4, 0]} rotation={[0, 0, 0.35]}>
        <mesh><cylinderGeometry args={[0.14, 0.1, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>
        <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.1, 0.15, 0.4, 6]} /><meshStandardMaterial color="#616161" flatShading /></mesh>
        {/* Crushing claw */}
        <mesh position={[-0.06, -0.6, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.04, 0.18, 4]} /><meshStandardMaterial color="#212121" /></mesh>
        <mesh position={[0.06, -0.6, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.04, 0.18, 4]} /><meshStandardMaterial color="#212121" /></mesh>
      </group>
      <group position={[0.55, 0.4, 0]} rotation={[0, 0, -0.35]}>
        <mesh><cylinderGeometry args={[0.14, 0.1, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>
        <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.1, 0.15, 0.4, 6]} /><meshStandardMaterial color="#616161" flatShading /></mesh>
        <mesh position={[-0.06, -0.6, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.04, 0.18, 4]} /><meshStandardMaterial color="#212121" /></mesh>
        <mesh position={[0.06, -0.6, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.04, 0.18, 4]} /><meshStandardMaterial color="#212121" /></mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.2, -0.2, 0]}><cylinderGeometry args={[0.14, 0.18, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>
      <mesh position={[0.2, -0.2, 0]}><cylinderGeometry args={[0.14, 0.18, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>

      <pointLight color="#FF6D00" intensity={1} distance={3} />
    </group>
  )
}

/* ═══ 🪓 PUTOL — The Chainsaw General ═══
   Corrupted dead-wood treant with chainsaw blade arms,
   hollow stump head, sawdust particles, splintered body */
export function PutolModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const sawRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.85 + Math.sin(t * 1.3) * 0.05
    group.current.rotation.y = Math.sin(t * 0.35) * 0.08

    // Chainsaw vibration
    if (sawRef.current) {
      sawRef.current.children.forEach((child) => {
        child.position.y += Math.sin(t * 20) * 0.003
      })
    }

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.85, 0]} scale={0.85}>
      {/* Head — hollow tree stump */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.25, 8]} />
        <meshStandardMaterial color="#3E2723" flatShading />
      </mesh>
      {/* Hollow cavity */}
      <mesh position={[0, 0.72, 0.08]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 8]} />
        <meshStandardMaterial color="#1a0e08" />
      </mesh>
      {/* Glowing amber eyes inside cavity */}
      <mesh position={[-0.05, 0.73, 0.14]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FFAB00" emissive="#FF8F00" emissiveIntensity={5} /></mesh>
      <mesh position={[0.05, 0.73, 0.14]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FFAB00" emissive="#FF8F00" emissiveIntensity={5} /></mesh>

      {/* Torso — splintered dead wood */}
      <mesh position={[0, 0.3, 0]} scale={[0.9, 1.3, 0.7]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 7]} />
        <meshStandardMaterial color="#4E342E" flatShading />
      </mesh>
      {/* Wood grain / splinter lines */}
      <mesh position={[0, 0.3, 0]} scale={[0.92, 1.32, 0.72]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 7]} />
        <meshStandardMaterial color="#6D4C41" emissive="#5D4037" emissiveIntensity={0.3} wireframe />
      </mesh>

      {/* Broken branch spikes on shoulders */}
      {[[-0.28, 0.55, 0], [0.28, 0.55, 0], [-0.2, 0.6, -0.1], [0.22, 0.58, -0.08]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0.2, 0, (i - 1.5) * 0.4]}>
          <coneGeometry args={[0.03, 0.18, 5]} />
          <meshStandardMaterial color="#5D4037" flatShading />
        </mesh>
      ))}

      {/* Chainsaw arms */}
      <group ref={sawRef}>
        {/* Left chainsaw arm */}
        <group position={[-0.45, 0.25, 0]} rotation={[0, 0, 0.5]}>
          <mesh><cylinderGeometry args={[0.08, 0.06, 0.35, 6]} /><meshStandardMaterial color="#4E342E" flatShading /></mesh>
          {/* Blade */}
          <mesh position={[0, -0.35, 0]} scale={[0.15, 0.5, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#616161" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Blade teeth */}
          {[-0.15, -0.08, 0, 0.08, 0.15].map((y, i) => (
            <mesh key={i} position={[-0.08, -0.22 + y * 1.5, 0]} rotation={[0, 0, 0.5]}>
              <coneGeometry args={[0.01, 0.04, 3]} />
              <meshStandardMaterial color="#FF8F00" emissive="#E65100" emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
        {/* Right chainsaw arm */}
        <group position={[0.45, 0.25, 0]} rotation={[0, 0, -0.5]}>
          <mesh><cylinderGeometry args={[0.08, 0.06, 0.35, 6]} /><meshStandardMaterial color="#4E342E" flatShading /></mesh>
          <mesh position={[0, -0.35, 0]} scale={[0.15, 0.5, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#616161" metalness={0.8} roughness={0.2} />
          </mesh>
          {[-0.15, -0.08, 0, 0.08, 0.15].map((y, i) => (
            <mesh key={i} position={[0.08, -0.22 + y * 1.5, 0]} rotation={[0, 0, -0.5]}>
              <coneGeometry args={[0.01, 0.04, 3]} />
              <meshStandardMaterial color="#FF8F00" emissive="#E65100" emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Root legs */}
      <mesh position={[-0.15, -0.15, 0.05]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.1, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#3E2723" flatShading />
      </mesh>
      <mesh position={[0.15, -0.15, -0.05]} rotation={[-0.1, 0, -0.1]}>
        <cylinderGeometry args={[0.1, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#3E2723" flatShading />
      </mesh>

      <pointLight color="#FF8F00" intensity={0.7} distance={3} />
    </group>
  )
}

/* ═══ 🌊 LASON — The Poison General ═══
   Underwater trash horror — mass of garbage and debris
   formed into a kraken-like creature with tentacles,
   shark jaw, glowing yellow eyes, dripping poison */
export function LasonModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const tentaclesRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.95 + Math.sin(t * 1.3) * 0.12
    group.current.rotation.y = Math.sin(t * 0.4) * 0.08

    // Tentacle wave
    if (tentaclesRef.current) {
      tentaclesRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 1.5 + i * 1.2) * 0.4
        child.rotation.x = Math.cos(t * 1.2 + i * 0.8) * 0.2
      })
    }

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.95, 0]} scale={0.85}>
      {/* Main body — mass of garbage */}
      <mesh position={[0, 0.1, 0]} scale={[1.2, 0.9, 1]}>
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#1a2e1a" emissive="#004D40" emissiveIntensity={0.2} flatShading />
      </mesh>
      {/* Debris bumps */}
      {[[0.2, 0.25, 0.15], [-0.18, 0.2, -0.12], [0.1, 0, 0.28], [-0.15, -0.1, 0.2]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <dodecahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color={['#455A64', '#795548', '#37474F', '#4E342E'][i]} flatShading />
        </mesh>
      ))}

      {/* Shark jaw */}
      <mesh position={[0.15, 0.05, 0.3]} rotation={[0.2, -0.3, 0]}>
        <coneGeometry args={[0.12, 0.15, 6]} />
        <meshStandardMaterial color="#37474F" flatShading />
      </mesh>
      {/* Teeth */}
      {[-0.04, 0, 0.04].map((x, i) => (
        <mesh key={i} position={[0.15 + x, 0.0, 0.38]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.012, 0.06, 3]} />
          <meshStandardMaterial color="#ECEFF1" />
        </mesh>
      ))}

      {/* Glowing yellow eyes */}
      <mesh position={[-0.08, 0.18, 0.28]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FFD600" emissive="#FFAB00" emissiveIntensity={5} /></mesh>
      <mesh position={[0.06, 0.15, 0.3]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#FFD600" emissive="#FFAB00" emissiveIntensity={5} /></mesh>

      {/* Tentacles */}
      <group ref={tentaclesRef}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <group key={i} position={[
            Math.cos(angle * Math.PI / 180) * 0.3,
            -0.2,
            Math.sin(angle * Math.PI / 180) * 0.3,
          ]}>
            <mesh rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.015, 0.6, 6]} />
              <meshStandardMaterial color="#263238" emissive="#004D40" emissiveIntensity={0.3} />
            </mesh>
            {/* Poison drip at tip */}
            <mesh position={[0, -0.35, 0]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={3} transparent opacity={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Toxic aura */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 8, 16]} />
        <meshStandardMaterial color="#76FF03" emissive="#00E676" emissiveIntensity={1.5} transparent opacity={0.3} />
      </mesh>

      <pointLight color="#FFAB00" intensity={0.8} distance={3} />
    </group>
  )
}

/* ═══ ☠️ ANG DUMI — The Final Boss ═══
   Colossal amalgamation of ALL pollution — smoke upper body,
   toxic sludge torso, mining debris limbs, dead wood spine,
   multiple mismatched eyes, dark void core, crown of waste */
export function AngDumiModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.9 + Math.sin(t * 0.8) * 0.06
    group.current.rotation.y += delta * -0.15

    // Dark core pulse
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2 + Math.sin(t * 2) * 1.5
      coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1)
    }

    const isAttacking = role === 'general' && animPhase === 'enemy_attacking'
    const tx = isAttacking ? baseX - 1.5 : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.08)
    group.current.visible = hp > 0
  })

  return (
    <group ref={group} position={[baseX, 0.9, 0]} scale={1.1}>
      {/* ── Smoke upper body ── */}
      <mesh position={[0, 0.6, 0]} scale={[1.2, 0.8, 1]}>
        <dodecahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#263238" emissive="#37474F" emissiveIntensity={0.3} flatShading transparent opacity={0.6} />
      </mesh>

      {/* ── Head — crown of smokestacks and waste ── */}
      <mesh position={[0, 0.85, 0]}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#212121" emissiveIntensity={0.3} flatShading />
      </mesh>
      {/* Crown — smokestacks, pipes, spikes */}
      {[[-0.12, 1.05, 0], [0, 1.1, -0.05], [0.12, 1.03, 0], [-0.06, 1.0, 0.1], [0.08, 1.02, 0.08]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0.1 * (i - 2), 0, (i - 2) * 0.08]}>
          <cylinderGeometry args={[0.02, 0.03, 0.15, 5]} />
          <meshStandardMaterial color={['#424242', '#795548', '#455A64', '#616161', '#3E2723'][i]} />
        </mesh>
      ))}

      {/* Multiple mismatched eyes */}
      <mesh position={[-0.08, 0.88, 0.18]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      <mesh position={[0.09, 0.86, 0.17]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FFAB00" emissive="#FF8F00" emissiveIntensity={5} /></mesh>
      <mesh position={[0, 0.92, 0.15]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={4} /></mesh>
      <mesh position={[-0.12, 0.84, 0.12]}><sphereGeometry args={[0.018, 8, 8]} /><meshStandardMaterial color="#00BCD4" emissive="#0097A7" emissiveIntensity={4} /></mesh>

      {/* ── Toxic sludge torso ── */}
      <mesh position={[0, 0.25, 0]} scale={[1.3, 1.5, 1]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#1B0A2E" emissive="#311B92" emissiveIntensity={0.2} flatShading />
      </mesh>
      {/* Multi-element crack wireframe */}
      <mesh position={[0, 0.25, 0]} scale={[1.32, 1.52, 1.02]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#FF6D00" emissive="#E65100" emissiveIntensity={1.2} wireframe />
      </mesh>

      {/* ── DARK VOID CORE — pulsing center ── */}
      <mesh ref={coreRef} position={[0, 0.3, 0.25]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" emissive="#4A148C" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      {/* Void ring */}
      <mesh position={[0, 0.3, 0.25]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.14, 0.015, 8, 16]} />
        <meshStandardMaterial color="#7B1FA2" emissive="#4A148C" emissiveIntensity={3} transparent opacity={0.6} />
      </mesh>

      {/* ── Mining debris arms ── */}
      <group position={[-0.55, 0.35, 0]} rotation={[0, 0, 0.35]}>
        <mesh><cylinderGeometry args={[0.12, 0.1, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>
        <mesh position={[0, -0.35, 0]}><dodecahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color="#263238" flatShading /></mesh>
        {/* Rebar spikes */}
        <mesh position={[0.08, -0.15, 0]} rotation={[0, 0, -0.8]}><cylinderGeometry args={[0.01, 0.008, 0.15, 4]} /><meshStandardMaterial color="#795548" /></mesh>
      </group>
      <group position={[0.55, 0.35, 0]} rotation={[0, 0, -0.35]}>
        <mesh><cylinderGeometry args={[0.12, 0.1, 0.5, 6]} /><meshStandardMaterial color="#424242" flatShading /></mesh>
        <mesh position={[0, -0.35, 0]}><dodecahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color="#263238" flatShading /></mesh>
        <mesh position={[-0.08, -0.15, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.01, 0.008, 0.15, 4]} /><meshStandardMaterial color="#795548" /></mesh>
      </group>

      {/* ── Dead wood spine ── */}
      {[0.5, 0.35, 0.2].map((y, i) => (
        <mesh key={i} position={[0, y, -0.25]} rotation={[-0.3, 0, (i - 1) * 0.1]}>
          <coneGeometry args={[0.03, 0.15, 5]} />
          <meshStandardMaterial color="#3E2723" flatShading />
        </mesh>
      ))}

      {/* ── Legs ── */}
      <mesh position={[-0.2, -0.2, 0]}><cylinderGeometry args={[0.13, 0.16, 0.5, 6]} /><meshStandardMaterial color="#212121" flatShading /></mesh>
      <mesh position={[0.2, -0.2, 0]}><cylinderGeometry args={[0.13, 0.16, 0.5, 6]} /><meshStandardMaterial color="#212121" flatShading /></mesh>

      {/* ── Multi-element aura rings ── */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.015, 8, 24]} />
        <meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={1} transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[0.55, 0.012, 8, 24]} />
        <meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={1} transparent opacity={0.2} />
      </mesh>

      <pointLight color="#7B1FA2" intensity={1.5} distance={4} />
      <pointLight color="#FF6D00" intensity={0.5} distance={2} position={[0, 0.3, 0.3]} />
    </group>
  )
}
/* ═══════════════════════════════════════════════
   LOOKUP — Maps guardian/general name → model
   Checks for .glb first, falls back to procedural
   ═══════════════════════════════════════════════ */

export function GuardianModelLookup({ name, ...props }: ModelProps & { name: string }) {
  if (hasGLBModel(name)) {
    return <GLBModel name={name} {...props} />
  }
  switch (name) {
    case 'luntian':  return <LuntianModel {...props} />
    case 'alon':     return <AlonModel {...props} />
    case 'bulkan':   return <BulkanModel {...props} />
    case 'haribon':  return <HaribonModel {...props} />
    case 'pawikan':  return <PawikanModel {...props} />
    default:         return <LuntianModel {...props} />
  }
}

export function GeneralModelLookup({ name, ...props }: ModelProps & { name: string }) {
  if (hasGLBModel(name)) {
    return <GLBModel name={name} {...props} />
  }
  switch (name) {
    case 'usok':     return <UsokModel {...props} />
    case 'mantsa':   return <MantsaModel {...props} />
    case 'hukay':    return <HukayModel {...props} />
    case 'putol':    return <PutolModel {...props} />
    case 'lason':    return <LasonModel {...props} />
    case 'ang_dumi': return <AngDumiModel {...props} />
    default:         return <UsokModel {...props} />
  }
}
