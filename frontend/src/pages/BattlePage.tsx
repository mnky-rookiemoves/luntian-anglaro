/**
 * ⚔️ LUNTIAN ANGLARO — Battle Page
 * Two modes:
 * - Story Mode: locked matchup, auto-starts, returns to story
 * - Free Battle: choose any guardian vs any general
 */
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGameStore } from '@/store'
import { ELEMENT_CONFIG } from '@/types/game.types'
import type { Guardian, General } from '@/types/game.types'
import { toast } from 'sonner'
import Battle3DArena from '@/components/battle3d/Battle3DArena'

const BattlePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { guardians, generals, initialize, isInitialized, language } = useGameStore()

  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null)
  const [selectedGeneral, setSelectedGeneral] = useState<General | null>(null)
  const [inBattle, setInBattle] = useState(false)

  // Story mode params
  const storyMode = searchParams.get('mode') === 'story'
  const storyGuardian = searchParams.get('guardian')
  const storyGeneral = searchParams.get('general')
  const storyChapter = searchParams.get('chapter')
  const storyScene = searchParams.get('scene')

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [initialize, isInitialized])

  // Story Mode: Auto-select and start battle immediately
  useEffect(() => {
    if (storyMode && storyGuardian && storyGeneral && guardians.length > 0 && generals.length > 0 && !inBattle) {
      const g = guardians.find((g) => g.name === storyGuardian)
      const gen = generals.find((g) => g.name === storyGeneral)
      if (g && gen) {
        setSelectedGuardian(g)
        setSelectedGeneral(gen)
        setInBattle(true)
      }
    }
  }, [storyMode, storyGuardian, storyGeneral, guardians, generals])

  // Start free battle
  const startBattle = () => {
    if (selectedGuardian && selectedGeneral) {
      setInBattle(true)
    }
  }

  const handleBattleEnd = (won: boolean) => {
    if (won) {
      toast.success(
        language === 'en'
          ? `🏆 Victory! ${selectedGeneral?.display_name} has been defeated!`
          : `🏆 Tagumpay! Natalo si ${selectedGeneral?.display_name}!`,
        { duration: 5000 }
      )
    } else {
      toast.error(
        language === 'en'
          ? `💀 Defeated by ${selectedGeneral?.display_name}. Try again!`
          : `💀 Natalo ni ${selectedGeneral?.display_name}. Subukan muli!`,
        { duration: 5000 }
      )
    }
  }

  const exitBattle = () => {
    if (storyMode && storyChapter) {
      // Return to story and advance past the battle scene
      const nextScene = storyScene ? Number(storyScene) + 1 : 0
      navigate(`/story/${storyChapter}?resume=${nextScene}`)
    } else {
      setInBattle(false)
      setSelectedGuardian(null)
      setSelectedGeneral(null)
    }
  }

  // ── Battle Mode ──
  if (inBattle && selectedGuardian && selectedGeneral) {
    return (
      <div className="p-6">
        {storyMode && (
          <div className="text-center mb-3">
            <span className="text-xs px-3 py-1 rounded-full bg-[var(--luntian-primary)]/15 text-[var(--luntian-primary)] border border-[var(--luntian-primary)]/30">
              📖 {language === 'en' ? 'Story Battle' : 'Laban sa Kwento'}
            </span>
          </div>
        )}
        <Battle3DArena
          guardian={selectedGuardian}
          general={selectedGeneral}
          language={language}
          onBattleEnd={handleBattleEnd}
          onExit={exitBattle}
        />
      </div>
    )
  }

  // ── Selection Screen (Free Battle Only) ──
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--luntian-primary)] mb-2">
        ⚔️ {language === 'en' ? 'Battle Simulator' : 'Simulador ng Laban'}
      </h1>
      <p className="text-[var(--luntian-text-muted)] mb-8">
        {language === 'en' ? 'Choose your Guardian and face a General in combat!' : 'Pumili ng iyong Tagapag-alaga at harapin ang isang Heneral sa laban!'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── Select Guardian ── */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--luntian-primary)] mb-4">
            🛡️ {language === 'en' ? 'Select Guardian' : 'Pumili ng Tagapag-alaga'}
          </h2>
          <div className="space-y-3">
            {(Array.isArray(guardians) ? guardians : []).map((g) => {
              const config = ELEMENT_CONFIG[g.element]
              const isSelected = selectedGuardian?.id === g.id
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuardian(g)}
                  className={`rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${config.color}15` : 'var(--luntian-surface)',
                    borderColor: isSelected ? config.color : `${config.color}30`,
                    ringColor: isSelected ? config.color : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.emoji}</span>
                      <div>
                        <div className="font-bold" style={{ color: config.color }}>{g.display_name}</div>
                        <div className="text-xs text-[var(--luntian-text-muted)]">
                          {g.element_display} • {g.combat_role_display}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-[var(--luntian-text-muted)]">
                      <div>{g.power_1}</div>
                      <div>{g.power_2}</div>
                      <div>{g.power_3}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Select General ── */}
        <div>
          <h2 className="text-lg font-semibold text-red-400 mb-4">
            💀 {language === 'en' ? 'Select General' : 'Pumili ng Heneral'}
          </h2>
          <div className="space-y-3">
            {(Array.isArray(generals) ? generals : []).map((g) => {
              const isSelected = selectedGeneral?.id === g.id
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGeneral(g)}
                  className={`rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isSelected ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#EF535015' : 'var(--luntian-surface)',
                    borderColor: isSelected ? '#EF5350' : '#EF535030',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💀</span>
                      <div>
                        <div className="font-bold text-red-400">{g.display_name}</div>
                        <div className="text-xs text-red-300/60">{g.threat_display}</div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-[var(--luntian-text-muted)]">
                      <div>{g.battle_phases} phases</div>
                      {g.weakness_element && (
                        <div className="text-green-400">⚡ {g.weakness_element}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Fight Button ── */}
      <div className="mt-8 text-center">
        <button
          onClick={startBattle}
          disabled={!selectedGuardian || !selectedGeneral}
          className="px-12 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: selectedGuardian && selectedGeneral
              ? 'linear-gradient(135deg, var(--luntian-primary), #EF5350)'
              : '#333',
            boxShadow: selectedGuardian && selectedGeneral
              ? '0 0 30px rgba(76, 175, 80, 0.3), 0 0 30px rgba(239, 83, 80, 0.3)'
              : 'none',
          }}
        >
          {selectedGuardian && selectedGeneral
            ? `⚔️ ${selectedGuardian.display_name} vs ${selectedGeneral.display_name} — ${language === 'en' ? 'FIGHT!' : 'LABAN!'}`
            : `⚔️ ${language === 'en' ? 'Select both to fight' : 'Pumili ng dalawa para lumaban'}`}
        </button>
      </div>
    </div>
  )
}

export default BattlePage