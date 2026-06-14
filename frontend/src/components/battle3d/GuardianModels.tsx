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
   ═══════════════════════════════════════════════ */

/* Usok — Smoke General */
export function UsokModel({ animPhase, hp, role, baseX }: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  const prevPhase = useRef(animPhase)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 1.0 + Math.sin(t * 1.8) * 0.1
    group.current.rotation.y += delta * -0.5

    const isAttacking = (role === 'general' && animPhase === 'enemy_attacking') || (role === 'guardian' && animPhase === 'player_attacking')
    const tx = isAttacking ? baseX + (role === 'general' ? -1.5 : 1.5) : baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = hp > 0
    prevPhase.current = animPhase
  })

  return (
    <group ref={group} position={[baseX, 1, 0]}>
      {/* Smoke cloud body */}
      {[[0, 0, 0], [0.15, 0.12, 0.08], [-0.12, 0.15, -0.06], [0.08, -0.1, 0.1], [-0.1, -0.08, -0.08]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} scale={0.8 + Math.random() * 0.4}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#37474F" emissive="#263238" emissiveIntensity={0.3} transparent opacity={0.65} />
        </mesh>
      ))}
      {/* Red glowing eyes */}
      <mesh position={[-0.1, 0.08, 0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      <mesh position={[0.1, 0.08, 0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      {/* Wispy tendrils */}
      {[0, 72, 144, 216, 288].map((a, i) => (
        <mesh key={`t${i}`} position={[Math.cos(a * Math.PI / 180) * 0.2, -0.3, Math.sin(a * Math.PI / 180) * 0.2]} rotation={[0.3, 0, (i - 2) * 0.15]}>
          <cylinderGeometry args={[0.03, 0.01, 0.4, 5]} />
          <meshStandardMaterial color="#455A64" transparent opacity={0.4} />
        </mesh>
      ))}
      <pointLight color="#FF1744" intensity={0.8} distance={3} />
    </group>
  )
}

/* Mantsa — Toxic Water Sludge */
export function MantsaModel(props: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 0.8 + Math.sin(t * 1.5) * 0.08
    group.current.rotation.y += 0.003
    const isAttacking = (props.role === 'general' && props.animPhase === 'enemy_attacking')
    const tx = isAttacking ? props.baseX - 1.5 : props.baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = props.hp > 0
  })
  return (
    <group ref={group} position={[props.baseX, 0.8, 0]}>
      <mesh scale={[1.2, 0.8, 1]}><sphereGeometry args={[0.4, 8, 8]} /><meshStandardMaterial color="#33691E" emissive="#1B5E20" emissiveIntensity={0.4} flatShading /></mesh>
      <mesh position={[0, 0.2, 0]} scale={[0.8, 0.5, 0.8]}><sphereGeometry args={[0.3, 8, 8]} /><meshStandardMaterial color="#2E7D32" emissive="#1B5E20" emissiveIntensity={0.3} flatShading transparent opacity={0.8} /></mesh>
      {/* Toxic bubbles */}
      {[[0.2, 0.35, 0.1], [-0.15, 0.4, -0.08], [0.05, 0.45, 0.15]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#76FF03" emissive="#64DD17" emissiveIntensity={3} transparent opacity={0.6} /></mesh>
      ))}
      <mesh position={[-0.1, 0.15, 0.3]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={4} /></mesh>
      <mesh position={[0.1, 0.15, 0.3]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={4} /></mesh>
      <pointLight color="#76FF03" intensity={0.6} distance={3} />
    </group>
  )
}

/* Generic General fallback (Hukay, Putol, Lason, Ang Dumi) */
export function GenericGeneralModel(props: ModelProps) {
  const group = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = 1.0 + Math.sin(t * 1.5) * 0.1
    group.current.rotation.y += 0.005
    const isAttacking = props.animPhase === 'enemy_attacking'
    const tx = isAttacking ? props.baseX - 1.5 : props.baseX
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.12)
    group.current.visible = props.hp > 0
  })
  return (
    <group ref={group} position={[props.baseX, 1, 0]}>
      <mesh><octahedronGeometry args={[0.5, 1]} /><meshStandardMaterial color="#8B0000" emissive="#B71C1C" emissiveIntensity={0.5} flatShading /></mesh>
      <mesh scale={1.05}><octahedronGeometry args={[0.5, 1]} /><meshStandardMaterial color="#FF3D00" emissive="#DD2C00" emissiveIntensity={1} wireframe /></mesh>
      <mesh position={[-0.1, 0.1, 0.4]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      <mesh position={[0.1, 0.1, 0.4]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FF1744" emissive="#D50000" emissiveIntensity={5} /></mesh>
      <pointLight color="#FF3D00" intensity={0.8} distance={3} />
    </group>
  )
}

/* ═══════════════════════════════════════════════
   LOOKUP — Maps guardian/general name → model
   ═══════════════════════════════════════════════ */
export function GuardianModelLookup({ name, ...props }: ModelProps & { name: string }) {
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
  switch (name) {
    case 'usok':     return <UsokModel {...props} />
    case 'mantsa':   return <MantsaModel {...props} />
    default:         return <GenericGeneralModel {...props} />
  }
}