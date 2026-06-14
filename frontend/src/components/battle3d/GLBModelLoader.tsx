/**
 * 🎮 LUNTIAN ANGLARO — GLB Model Loader
 * Loads .glb 3D models with fallback to procedural models.
 * Drop a .glb file into public/models/ and it auto-detects!
 *
 * Pipeline: .glb exists? → use it : fall back to procedural
 */
import { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import type { AnimPhase } from '@/hooks/useBattleLogic'

/* ═══════════════════════════════════════════════
   MODEL REGISTRY
   Maps model names to their .glb file paths.
   Set `available: true` when you drop a .glb file in!
   ═══════════════════════════════════════════════ */
export const MODEL_REGISTRY: Record<string, {
  path: string
  available: boolean
  scale: number
  yOffset: number
}> = {
  // Guardians
  luntian:  { path: '/models/guardians/luntian.glb',  available: true, scale: 0.8, yOffset: 0 },
  alon:     { path: '/models/guardians/alon.glb',     available: true, scale: 0.8, yOffset: 0 },
  bulkan:   { path: '/models/guardians/bulkan.glb',   available: true, scale: 0.8, yOffset: 0 },
  haribon:  { path: '/models/guardians/haribon.glb',  available: true, scale: 0.8, yOffset: 0 },
  pawikan:  { path: '/models/guardians/pawikan.glb',  available: true, scale: 0.8, yOffset: 0 },
  // Generals
  usok:     { path: '/models/generals/usok.glb',      available: true, scale: 0.8, yOffset: 0 },
  mantsa:   { path: '/models/generals/mantsa.glb',    available: true, scale: 0.8, yOffset: 0 },
  hukay:    { path: '/models/generals/hukay.glb',     available: true, scale: 0.8, yOffset: 0 },
  putol:    { path: '/models/generals/putol.glb',     available: true, scale: 0.8, yOffset: 0 },
  lason:    { path: '/models/generals/lason.glb',     available: true, scale: 0.8, yOffset: 0 },
  ang_dumi: { path: '/models/generals/ang_dumi.glb',  available: true, scale: 1.0, yOffset: 0 },
}

/* ═══════════════════════════════════════════════
   Check if a model has a .glb available
   ═══════════════════════════════════════════════ */
export function hasGLBModel(name: string): boolean {
  return MODEL_REGISTRY[name]?.available ?? false
}

export function getModelConfig(name: string) {
  return MODEL_REGISTRY[name] ?? { path: '', available: false, scale: 0.8, yOffset: 0 }
}

/* ═══════════════════════════════════════════════
   GLB Model Component
   Loads a .glb file with battle animations
   (bob, lunge, hit flash, death fade)
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
  const { scene, animations } = useGLTF(config.path)
  const group = useRef<THREE.Group>(null!)
  const clonedScene = useRef<THREE.Group | null>(null)
  const flashRef = useRef(0)
  const prevPhase = useRef(animPhase)

  // Clone the scene so multiple instances don't conflict
  useEffect(() => {
    if (scene) {
      clonedScene.current = scene.clone()

      // Enable shadows on all meshes
      clonedScene.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  // Optional: play built-in animations if the .glb has them
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    // Auto-play 'idle' animation if it exists
    if (actions['idle']) {
      actions['idle'].reset().fadeIn(0.3).play()
    } else if (actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.3).play()
    }
  }, [actions])

  // Play attack/hit animations if they exist
  useEffect(() => {
    const isMyAttack =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')
    const isMyHit =
      (role === 'guardian' && animPhase === 'enemy_hit') ||
      (role === 'general' && animPhase === 'player_hit')

    if (isMyAttack) {
      const attackAnim = actions['attack'] || actions['Attack']
      if (attackAnim) {
        attackAnim.reset().fadeIn(0.1).setLoop(THREE.LoopOnce, 1).play()
        attackAnim.clampWhenFinished = true
      }
    }

    if (isMyHit && prevPhase.current !== animPhase) {
      flashRef.current = 1.0
      const hitAnim = actions['hit'] || actions['Hit'] || actions['damage']
      if (hitAnim) {
        hitAnim.reset().fadeIn(0.1).setLoop(THREE.LoopOnce, 1).play()
        hitAnim.clampWhenFinished = true
      }
    }

    prevPhase.current = animPhase
  }, [animPhase, role, actions])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    // ── Bob animation (gentle hover) ──
    group.current.position.y = config.yOffset + Math.sin(t * 2) * 0.1

    // ── Lunge toward enemy when attacking ──
    const isAttacking =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')
    const targetX = isAttacking
      ? baseX + (role === 'guardian' ? 1.5 : -1.5)
      : baseX
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      targetX,
      0.12,
    )

    // ── Hit flash decay ──
    if (flashRef.current > 0) {
      flashRef.current = Math.max(0, flashRef.current - delta * 4)
    }

    // Apply flash to all materials
    group.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat?.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = flashRef.current * 3
        }
      }
    })

    // ── Death fade ──
    if (hp <= 0) {
      group.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          if (mat) {
            mat.transparent = true
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.15, 0.05)
          }
        }
      })
    }

    // ── Pulse scale when attacking ──
    const pulseScale = isAttacking ? config.scale * (1.1 + Math.sin(t * 12) * 0.03) : config.scale
    group.current.scale.setScalar(pulseScale)

    // Update animation mixer
    if (mixer) mixer.update(delta)
  })

  if (!clonedScene.current) return null

  return (
    <group ref={group} position={[baseX, config.yOffset, 0]} scale={config.scale}>
      <primitive object={clonedScene.current} />
    </group>
  )
}

// Preload helper — call this to preload models in the background
export function preloadGLBModels() {
  Object.entries(MODEL_REGISTRY).forEach(([_, config]) => {
    if (config.available) {
      useGLTF.preload(config.path)
    }
  })
}