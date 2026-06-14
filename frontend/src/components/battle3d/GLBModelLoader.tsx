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
   COLOR MAP — applies colors to untextured .glb models
   ═══════════════════════════════════════════════ */
const MODEL_COLORS: Record<string, { primary: string; emissive: string; emissiveIntensity: number }> = {
  luntian:  { primary: '#81C784', emissive: '#4CAF50', emissiveIntensity: 0.5 },
  alon:     { primary: '#64B5F6', emissive: '#2196F3', emissiveIntensity: 0.6 },
  bulkan:   { primary: '#A1887F', emissive: '#FF5722', emissiveIntensity: 0.5 },
  haribon:  { primary: '#C8B89A', emissive: '#8BC34A', emissiveIntensity: 0.4 },
  pawikan:  { primary: '#80CBC4', emissive: '#FFD600', emissiveIntensity: 0.4 },
  usok:     { primary: '#90A4AE', emissive: '#FF5252', emissiveIntensity: 0.7 },
  mantsa:   { primary: '#9575CD', emissive: '#E040FB', emissiveIntensity: 0.7 },
  hukay:    { primary: '#A1887F', emissive: '#FF9100', emissiveIntensity: 0.7 },
  putol:    { primary: '#8D6E63', emissive: '#FFAB00', emissiveIntensity: 0.6 },
  lason:    { primary: '#4DB6AC', emissive: '#FFEB3B', emissiveIntensity: 0.6 },
  ang_dumi: { primary: '#7E57C2', emissive: '#D500F9', emissiveIntensity: 0.8 },
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
    const colors = MODEL_COLORS[name]
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const oldMat = mesh.material as THREE.MeshStandardMaterial
          const newMat = oldMat.clone()

          // If the model has no texture (gray), apply character colors
          if (!oldMat.map && colors) {
            newMat.color = new THREE.Color(colors.primary)
            newMat.emissive = new THREE.Color(colors.emissive)
            newMat.emissiveIntensity = colors.emissiveIntensity
            newMat.metalness = 0.2
            newMat.roughness = 0.7
          }

          mesh.material = newMat
        }
      }
    })
    return clone
  }, [scene, name])

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

    // ── Idle Bob ──
    group.current.position.y = config.yOffset + centerOffset.y + Math.sin(t * 1.5) * 0.12

    // ── Idle Breathing ──
    const breathScale = 1.0 + Math.sin(t * 2) * 0.03
    group.current.scale.set(breathScale, breathScale, breathScale)

    // ── Idle Sway ──
    group.current.rotation.z = Math.sin(t * 0.8) * 0.03
    group.current.rotation.x = Math.cos(t * 0.6) * 0.02

    // ── Lunge ──
    const isAttacking =
      (role === 'guardian' && animPhase === 'player_attacking') ||
      (role === 'general' && animPhase === 'enemy_attacking')
    const targetX = isAttacking
      ? baseX + (role === 'guardian' ? 1.5 : -1.5)
      : baseX
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x, targetX, 0.12,
    )

    // ── Slow auto-rotation ──
    group.current.rotation.y += delta * (role === 'general' ? -0.3 : 0.3)

    // ── Hit flash ──
    const isMyHit =
      (role === 'guardian' && animPhase === 'enemy_hit') ||
      (role === 'general' && animPhase === 'player_hit')
    if (isMyHit && prevPhase.current !== animPhase) flashRef.current = 1
    prevPhase.current = animPhase
    flashRef.current = Math.max(0, flashRef.current - delta * 4)

    // ── Animate mesh children based on position (limb simulation) ──
    group.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial

        // Inject vertex animation via onBeforeCompile (runs once)
        if (!mat.userData.animated) {
          mat.userData.animated = true
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 }
            mat.userData.shader = shader

            // Inject time uniform declaration
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              uniform float uTime;`
            )

            // Inject vertex displacement before project_vertex
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
              
              // Height-based animation (0 = feet, 1 = head)
              float heightFactor = clamp(position.y * 0.5 + 0.5, 0.0, 1.0);
              
              // Upper body sway (arms, head move more)
              float upperSway = heightFactor * heightFactor;
              transformed.x += sin(uTime * 1.8 + position.y * 2.0) * upperSway * 0.04;
              transformed.z += cos(uTime * 1.3 + position.y * 1.5) * upperSway * 0.03;
              
              // Walking motion (alternating leg movement)
              float legFactor = 1.0 - heightFactor;
              float legMotion = sin(uTime * 3.0 + position.x * 8.0) * legFactor * legFactor * 0.03;
              transformed.y += legMotion;
              transformed.z += sin(uTime * 3.0 + position.x * 6.0) * legFactor * 0.02;
              
              // Torso twist
              float twist = sin(uTime * 1.5) * heightFactor * 0.02;
              float cosT = cos(twist);
              float sinT = sin(twist);
              vec3 twisted = transformed;
              twisted.x = transformed.x * cosT - transformed.z * sinT;
              twisted.z = transformed.x * sinT + transformed.z * cosT;
              transformed = twisted;
              `
            )
          }
          mat.needsUpdate = true
        }

        // Update time uniform each frame
        if (mat.userData.shader) {
          mat.userData.shader.uniforms.uTime.value = t
        }

        // Emissive pulse + flash
        if (mat) {
          const basePulse = 0.3 + Math.sin(t * 2.5) * 0.2
          if (mat.emissive) mat.emissiveIntensity = basePulse + flashRef.current * 3

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