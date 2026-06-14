/**
 * ⚔️ LUNTIAN ANGLARO — Battle Logic Hook
 * Pure game logic — decoupled from visuals.
 * Used by both 2D and 3D battle renderers.
 */
import { useState, useRef, useCallback } from 'react'
import type { Guardian, General } from '@/types/game.types'

const EFFECTIVENESS: Record<string, Record<string, number>> = {
  NATURE: { AIR: 1.5, WATER: 0.8, MINING: 1.0, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0, CORRUPT: 1.0 },
  WATER:  { AIR: 1.0, WATER: 1.5, MINING: 0.8, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0, CORRUPT: 1.0 },
  EARTH:  { AIR: 0.8, WATER: 1.0, MINING: 1.5, FOREST: 1.0, OCEAN: 1.0, FINAL: 1.0, CORRUPT: 1.0 },
  WIND:   { AIR: 1.0, WATER: 1.0, MINING: 1.0, FOREST: 1.5, OCEAN: 0.8, FINAL: 1.0, CORRUPT: 1.0 },
  MARINE: { AIR: 1.0, WATER: 1.0, MINING: 1.0, FOREST: 0.8, OCEAN: 1.5, FINAL: 1.0, CORRUPT: 1.0 },
}

export type AnimPhase =
  | 'idle'
  | 'player_attacking'
  | 'player_hit'
  | 'enemy_attacking'
  | 'enemy_hit'

export interface DamageEvent {
  id: number
  target: 'guardian' | 'general'
  amount: number
  isCrit: boolean
  isSuper: boolean
}

export interface BattleLogEntry {
  turn: number
  actor: 'guardian' | 'general'
  action: string
  damage: number
  message: string
}

export interface BattleStats {
  damageDealt: number
  damageTaken: number
  turnsPlayed: number
}

export function useBattleLogic(
  guardian: Guardian,
  general: General,
  language: 'en' | 'fil',
) {
  const [guardianHP, setGuardianHP] = useState(100)
  const [generalHP, setGeneralHP] = useState(100)
  const [turn, setTurn] = useState(1)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [battleOver, setBattleOver] = useState(false)
  const [winner, setWinner] = useState<'guardian' | 'general' | null>(null)
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle')
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([])
  const [damageEvents, setDamageEvents] = useState<DamageEvent[]>([])
  const [stats, setStats] = useState<BattleStats>({
    damageDealt: 0,
    damageTaken: 0,
    turnsPlayed: 0,
  })

  // Refs for values accessed inside setTimeout closures
  const gHPRef = useRef(100)
  const pHPRef = useRef(100)
  const overRef = useRef(false)
  const turnRef = useRef(true) // isPlayerTurn

  const effectiveness =
    EFFECTIVENESS[guardian.element]?.[general.threat_type] || 1.0

  const addLog = useCallback((entry: BattleLogEntry) => {
    setBattleLog((prev) => [entry, ...prev].slice(0, 30))
  }, [])

  const removeDamageEvent = useCallback((id: number) => {
    setDamageEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  /* ── PLAYER ATTACK ───────────────────────────── */
  const playerAttack = useCallback(
    (power: string, index: number) => {
      if (!turnRef.current || overRef.current) return

      // ── Compute all damage upfront ──
      const base = 10 + Math.floor(Math.random() * 10)
      const mult = [1.0, 1.2, 1.5][index]
      const raw = Math.floor(base * mult * effectiveness)
      const pCrit = Math.random() < 0.2
      const pDmg = pCrit ? Math.floor(raw * 1.5) : raw
      const isSuper = effectiveness > 1
      const newGHP = Math.max(0, gHPRef.current - pDmg)

      const eBase = 8 + Math.floor(Math.random() * 12)
      const eCrit = Math.random() < 0.15
      const eDmg = eCrit ? Math.floor(eBase * 1.5) : eBase
      const newPHP = Math.max(0, pHPRef.current - eDmg)

      const curTurn = turn

      // Lock input
      turnRef.current = false
      setIsPlayerTurn(false)

      // ── Phase 1: Guardian lunges ──
      setAnimPhase('player_attacking')

      setTimeout(() => {
        // ── Phase 2: Hit lands on general ──
        gHPRef.current = newGHP
        setGeneralHP(newGHP)
        setAnimPhase('player_hit')
        setDamageEvents((p) => [
          ...p,
          { id: Date.now(), target: 'general', amount: pDmg, isCrit: pCrit, isSuper },
        ])
        setStats((s) => ({
          ...s,
          damageDealt: s.damageDealt + pDmg,
          turnsPlayed: s.turnsPlayed + 1,
        }))

        let eff = ''
        if (isSuper) eff = language === 'en' ? ' (Super Effective!)' : ' (Sobrang Epektibo!)'
        else if (effectiveness < 1) eff = language === 'en' ? ' (Not Very Effective...)' : ' (Hindi Epektibo...)'

        addLog({
          turn: curTurn,
          actor: 'guardian',
          action: power,
          damage: pDmg,
          message:
            language === 'en'
              ? `${guardian.display_name} uses ${power} for ${pDmg} damage!${eff}${pCrit ? ' CRITICAL!' : ''}`
              : `Ginamit ni ${guardian.display_name} ang ${power} ng ${pDmg} pinsala!${eff}${pCrit ? ' CRITICAL!' : ''}`,
        })

        setTimeout(() => {
          setAnimPhase('idle')

          if (newGHP <= 0) {
            overRef.current = true
            setBattleOver(true)
            setWinner('guardian')
            return
          }

          // ── Phase 3: General attacks ──
          setTimeout(() => {
            setAnimPhase('enemy_attacking')

            setTimeout(() => {
              // ── Phase 4: Hit lands on guardian ──
              pHPRef.current = newPHP
              setGuardianHP(newPHP)
              setAnimPhase('enemy_hit')
              setDamageEvents((p) => [
                ...p,
                { id: Date.now() + 1, target: 'guardian', amount: eDmg, isCrit: eCrit, isSuper: false },
              ])
              setStats((s) => ({ ...s, damageTaken: s.damageTaken + eDmg }))

              addLog({
                turn: curTurn,
                actor: 'general',
                action: eCrit ? 'Critical Attack!' : 'Attack',
                damage: eDmg,
                message:
                  language === 'en'
                    ? `${general.display_name} ${eCrit ? 'lands a CRITICAL HIT for' : 'attacks for'} ${eDmg} damage!`
                    : `${general.display_name} ${eCrit ? 'nag-CRITICAL HIT ng' : 'umatake ng'} ${eDmg} pinsala!`,
              })

              setTimeout(() => {
                setAnimPhase('idle')

                if (newPHP <= 0) {
                  overRef.current = true
                  setBattleOver(true)
                  setWinner('general')
                  return
                }

                setTurn((t) => t + 1)
                turnRef.current = true
                setIsPlayerTurn(true)
              }, 400)
            }, 450)
          }, 300)
        }, 400)
      }, 500)
    },
    [effectiveness, guardian, general, turn, language, addLog],
  )

  return {
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
  }
}