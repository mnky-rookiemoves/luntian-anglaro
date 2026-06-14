/**
 * 🎮 LUNTIAN ANGLARO — GLB Model Loader
 * Loads .glb 3D models with fallback to procedural models.
 * Drop a .glb file into public/models/ and it auto-detects!
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { AnimPhase } from '@/hooks/useBattleLogic'

/* ═══════════════════════════════════════════════
   MODEL REGISTRY
   ═══════════════════════════════════════════════ */
export const MODEL_REGISTRY: Record<string, {
  path: string
  available: boolean
  scale: number
  yOffset: number
}> = {
  luntian:  { path: '/models/guardians/luntian.glb',  available: true, scale: 0.8, yOffset: 0 },
  alon:     { path: '/models/guardians/alon.glb',     available: true, scale: 0.8, yOffset: 0 },
  bulkan:   { path: '/models/guardians/bulkan.glb',   available: true, scale: 0.8, yOffset: 0 },
  haribon:  { path: '/models/guardians/haribon.glb',  available: true, scale: 0.8, yOffset: 0 },
  pawikan:  { path: '/models/guardians/pawikan.glb',  available: true, scale: 0.8, yOffset: 0 },
  usok:     { path: '/models/generals/usok.glb',      available: true, scale: 0.8, yOffset: 0 },
  mantsa:   { path: '/models/generals/mantsa.glb',    available: true, scale: 0.8, yOffset: 0 },
  hukay:    { path: '/models/generals/hukay.glb',     available: true, scale: 0.8, yOffset: 0 },
  putol:    { path: '/models/generals/putol.glb',     available: true, scale: 0.8, yOffset: 0 },
  lason:    { path: '/models/generals/lason.glb',     available: true, scale: 0.8, yOffset: 0 },
  ang_dumi: { path: '/models/generals/ang_dumi.glb',  available: true, scale: 1.0, yOffset: 0 },
}

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */
export function hasGLBModel(name: string): boolean {
  return MODEL_REGISTRY[name]?.available ?? false
}

export function getModelConfig(name: string) {
  return MODEL_REGISTRY[name] ?? { path: '', available: false, scale: 0.8, yOffset: 0 }
}

/* ═══════════════════════════════════════════════
   GLB MODEL COMPONENT
   ═══════════════════════════════════════════════ */
interface GLBModelProps {
  name: string
  animPhase: AnimPhase
  hp: number
  role: 'guardian' | 'general'
  baseX: number
}

export function GLBModel({ name, animPhase, hp, role, baseX }: GLBModelProps) {
  const config = getModelConfig(name)
  const { scene } = useGLTF(config.path)
  const group = useRef<THREE.Group>(null!)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone()
        }
      }
    })
    return clone
  }, [scene])

  const { autoScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 1.5
    const s = maxDim > 0 ? targetSize / maxDim : 1
    return {
      autoScale: s * config.scale,
      centerOffset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    }
  }, [clonedScene, config.scale])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // Bob
    group.current.position.y = config.yOffset + centerOffset.y + Math.sin(t * 2) * 0.1

    // Lunge
    const isAttacking =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')
    const targetX = isAttacking
      ? baseX + (role === 'guardian' ? 1.5 : -1.5)
      : baseX
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x, targetX, 0.12,
    )

    // Slow rotation
    group.current.rotation.y += delta * (role === 'general' ? -0.3 : 0.3)

    // Hit flash
    const isMyHit =
      (role === 'guardian' && animPhase === 'enemy_hit') ||
      (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    // Apply flash + death to materials
    group.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat) {
          if (mat.emissive) mat.emissiveIntensity = flashRef.current * 2
          if (hp <= 0) {
            mat.transparent = true
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.15, 0.05)
          }
        }
      }
    })
  })

  return (
    <group ref={group} position={[baseX, config.yOffset + centerOffset.y, 0]}>
      <primitive object={clonedScene} scale={autoScale} position={[centerOffset.x, 0, centerOffset.z]} />
    </group>
  )
}

// Preload helper
export function preloadGLBModels() {
  Object.entries(MODEL_REGISTRY).forEach(([_, config]) => {
    if (config.available) {
      useGLTF.preload(config.path)
    }
  })
}