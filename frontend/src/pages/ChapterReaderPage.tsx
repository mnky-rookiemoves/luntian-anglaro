/**
 * 📖 LUNTIAN ANGLARO — Chapter Reader
 * Visual novel with typewriter text, sound effects,
 * ambient atmosphere, and battle transitions.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChapter, getNextChapter } from '@/data/storyData'

/* ═══════════════════════════════════════════════
   SOUND ENGINE (Web Audio API — no external files!)
   ═══════════════════════════════════════════════ */
class StoryAudio {
  private ctx: AudioContext | null = null

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    return this.ctx
  }

  // Typewriter tick
  tick() {
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800 + Math.random() * 400
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.05)
    } catch {}
  }

  // Scene advance click
  advance() {
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 600
      osc.type = 'triangle'
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    } catch {}
  }

  // Guardian awakening chime
  awakening() {
    try {
      const ctx = this.getCtx()
      const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ctx.currentTime + i * 0.15
        gain.gain.setValueAtTime(0.12, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
        osc.start(t)
        osc.stop(t + 0.4)
      })
    } catch {}
  }

  // Battle warning
  battleAlert() {
    try {
      const ctx = this.getCtx()
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 200 + i * 100
        osc.type = 'sawtooth'
        const t = ctx.currentTime + i * 0.12
        gain.gain.setValueAtTime(0.06, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
        osc.start(t)
        osc.stop(t + 0.2)
      }
    } catch {}
  }

  // General whisper (eerie)
  generalWhisper() {
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 120
      osc.type = 'sawtooth'
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch {}
  }

  // Chapter complete fanfare
  fanfare() {
    try {
      const ctx = this.getCtx()
      const notes = [523, 659, 784, 880, 1047]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'triangle'
        const t = ctx.currentTime + i * 0.12
        gain.gain.setValueAtTime(0.1, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
        osc.start(t)
        osc.stop(t + 0.5)
      })
    } catch {}
  }
}

const audio = new StoryAudio()

/* ═══════════════════════════════════════════════
   SPEAKER CONFIG
   ═══════════════════════════════════════════════ */
const SPEAKER_COLORS: Record<string, string> = {
  narrator: '#B0BEC5',
  luntian: '#4CAF50',
  player: '#64B5F6',
  alon: '#2196F3',
  bulkan: '#FF5722',
  haribon: '#8BC34A',
  pawikan: '#FFB300',
  usok: '#90A4AE',
  mantsa: '#CE93D8',
  hukay: '#FF9800',
  putol: '#FF8F00',
  lason: '#26A69A',
  'ang dumi': '#EF5350',
  '???': '#EF5350',
}

const SPEAKER_EMOJIS: Record<string, string> = {
  narrator: '📖', luntian: '🌿', player: '👤', alon: '🌊',
  bulkan: '🌋', haribon: '🦅', pawikan: '🐢', usok: '💨',
  mantsa: '🏭', hukay: '⛏️', putol: '🪓', lason: '☠️',
  'ang dumi': '💀', '???': '❓',
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
export default function ChapterReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const navigate = useNavigate()

  // Get language safely
  let language = 'en'
  try {
    const store = (window as any).__LUNTIAN_STORE__
    language = store?.language || localStorage.getItem('luntian_language') || 'en'
  } catch { }

  // Try importing from store, fallback gracefully
  try {
    // eslint-disable-next-line
    const { useGameStore } = require('@/store')
    const storeState = useGameStore?.getState?.()
    if (storeState?.language) language = storeState.language
  } catch { }

  const isFil = language === 'fil'
  const chapter = chapterId ? getChapter(chapterId) : undefined

  const [sceneIdx, setSceneIdx] = useState(0)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showBattle, setShowBattle] = useState(false)
  const [showChapterComplete, setShowChapterComplete] = useState(false)
  const tickCounter = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Not found
  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#050a05] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-red-400 mb-4">Chapter not found</p>
          <button onClick={() => navigate('/story')} className="px-6 py-2 bg-[var(--luntian-primary)] text-white rounded-lg">
            Back to Story
          </button>
        </div>
      </div>
    )
  }

  const scenes = chapter.scenes
  const currentScene = scenes[sceneIdx]
  const currentDialogue = currentScene?.dialogues?.[dialogIdx]

  // Typewriter effect
  useEffect(() => {
    if (!currentDialogue) return

    const fullText = isFil ? currentDialogue.text_fil : currentDialogue.text_en
    setDisplayedText('')
    setIsTyping(true)
    tickCounter.current = 0

    // Play sound based on speaker type
    if (currentDialogue.speaker === 'general') audio.generalWhisper()
    if (currentScene?.type === 'awakening') audio.awakening()

    let i = 0
    timerRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1))
        i++
        // Play tick every 3rd character
        tickCounter.current++
        if (tickCounter.current % 3 === 0) audio.tick()
      } else {
        setIsTyping(false)
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, 25)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [sceneIdx, dialogIdx])

  const handleAdvance = useCallback(() => {
    if (showBattle || showChapterComplete) return

    // If typing, show full text
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current)
      const fullText = isFil
        ? currentDialogue?.text_fil || ''
        : currentDialogue?.text_en || ''
      setDisplayedText(fullText)
      setIsTyping(false)
      return
    }

    audio.advance()

    // More dialogues in current scene?
    if (currentScene && dialogIdx < currentScene.dialogues.length - 1) {
      setDialogIdx((p) => p + 1)
      return
    }

    // Battle scene?
    if (currentScene?.type === 'battle' && currentScene.battleConfig) {
      audio.battleAlert()
      setShowBattle(true)
      return
    }

    // More scenes?
    if (sceneIdx < scenes.length - 1) {
      setSceneIdx((p) => p + 1)
      setDialogIdx(0)
      return
    }

    // Chapter complete!
    audio.fanfare()
    const completed: string[] = JSON.parse(localStorage.getItem('luntian_completed_chapters') || '[]')
    if (!completed.includes(chapter.id)) {
      completed.push(chapter.id)
      localStorage.setItem('luntian_completed_chapters', JSON.stringify(completed))
    }
    const nextChapter = getNextChapter(chapter.id)
    if (nextChapter) {
      localStorage.setItem('luntian_current_chapter', nextChapter.id)
    }
    setShowChapterComplete(true)
  }, [isTyping, dialogIdx, sceneIdx, scenes.length, currentScene, currentDialogue, isFil, chapter.id])

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleAdvance()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAdvance])

  if (!currentDialogue) return null

  const speakerName = currentDialogue.speakerName || currentDialogue.speaker
  const speakerKey = speakerName.toLowerCase()
  const speakerColor = SPEAKER_COLORS[speakerKey] || '#B0BEC5'
  const speakerEmoji = SPEAKER_EMOJIS[speakerKey] || '💬'
  const isNarrator = currentDialogue.speaker === 'narrator'
  const isGeneral = currentDialogue.speaker === 'general'
  const isAwakening = currentScene.type === 'awakening'

  // Scene atmosphere
  const atmosphereBg = isAwakening
    ? 'bg-gradient-to-t from-green-900/30 via-transparent to-transparent'
    : isGeneral
      ? 'bg-gradient-to-t from-red-900/20 via-transparent to-transparent'
      : currentScene.type === 'battle'
        ? 'bg-gradient-to-t from-red-950/40 via-transparent to-transparent'
        : currentScene.type === 'cutscene'
          ? 'bg-gradient-to-t from-purple-900/20 via-transparent to-transparent'
          : 'bg-gradient-to-t from-green-950/10 via-transparent to-transparent'

  return (
    <div className="min-h-screen bg-[#050a05] flex flex-col" onClick={showBattle || showChapterComplete ? undefined : handleAdvance} style={{ cursor: showBattle || showChapterComplete ? 'default' : 'pointer' }}>

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-[var(--luntian-primary)]/10 flex-shrink-0 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/story') }}
          className="text-xs text-[var(--luntian-text-muted)] hover:text-[var(--luntian-primary)] transition-colors"
        >
          ← {isFil ? 'Bumalik' : 'Back'}
        </button>
        <div className="text-center">
          <span className="text-[10px] text-[var(--luntian-text-muted)]/60 uppercase tracking-widest mr-2">
            {chapter.chapterNumber === 0 ? (isFil ? 'Panimula' : 'Prologue') : `Ch.${chapter.chapterNumber}`}
          </span>
          <span className="text-xs text-[var(--luntian-text)] font-bold">
            {isFil ? chapter.title_fil : chapter.title_en}
          </span>
        </div>
        <span className="text-[10px] text-[var(--luntian-text-muted)]/40">
          {sceneIdx + 1}/{scenes.length}
        </span>
      </div>

      {/* ── Progress Bar ── */}
      <div className="w-full bg-black/30 h-1 flex-shrink-0">
        <div
          className="h-1 bg-[var(--luntian-primary)] transition-all duration-500"
          style={{ width: `${((sceneIdx + (dialogIdx / (currentScene?.dialogues.length || 1))) / scenes.length) * 100}%` }}
        />
      </div>

      {/* ── Main Story Area ── */}
      <div className={`flex-1 flex flex-col items-center justify-end relative px-4 pb-6 ${atmosphereBg}`}>

        {/* Floating particles based on scene */}
        {isAwakening && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-green-400/40 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Chapter Opening Quote (first scene only) */}
        {sceneIdx === 0 && dialogIdx === 0 && chapter.quote_en && (
          <div className="text-center mb-8 max-w-lg">
            <p className="text-xs text-[var(--luntian-text-muted)]/30 italic">
              "{isFil ? chapter.quote_fil : chapter.quote_en}"
            </p>
          </div>
        )}

        {/* Scene Type Badge */}
        <div className="mb-4">
          {isAwakening && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800/30 animate-pulse">
              ✨ {isFil ? 'Paggising ng Tagapag-alaga' : 'Guardian Awakening'}
            </span>
          )}
          {currentScene.type === 'battle' && !showBattle && (
            <span className="text-xs px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-800/30">
              ⚔️ {isFil ? 'Laban' : 'Battle'}
            </span>
          )}
          {currentScene.type === 'cutscene' && (
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/30">
              🎬 {isFil ? 'Eksena' : 'Cutscene'}
            </span>
          )}
        </div>

        {/* ═══ DIALOGUE BOX ═══ */}
        <div className="w-full max-w-3xl z-10">

          {/* Speaker Name */}
          {!isNarrator && (
            <div className="flex items-center gap-2 mb-2 ml-2">
              <span className="text-xl">{speakerEmoji}</span>
              <span className="font-bold text-sm" style={{ color: speakerColor }}>
                {speakerName === 'player' ? (isFil ? 'Ikaw' : 'You') : speakerName}
              </span>
              {currentDialogue.emotion && currentDialogue.emotion !== 'neutral' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 italic">
                  {currentDialogue.emotion}
                </span>
              )}
            </div>
          )}

          {/* Text Box */}
          <div
            className={`rounded-2xl p-6 border transition-all duration-300 ${
              isNarrator
                ? 'bg-black/70 border-white/10'
                : isGeneral
                  ? 'bg-red-950/50 border-red-900/40 shadow-[0_0_30px_rgba(239,83,80,0.1)]'
                  : isAwakening
                    ? 'bg-green-950/40 border-green-700/30 shadow-[0_0_30px_rgba(76,175,80,0.15)]'
                    : 'bg-[#0a1a0a]/90 border-[var(--luntian-primary)]/20'
            }`}
          >
            {/* Narrator label */}
            {isNarrator && (
              <div className="flex items-center gap-2 mb-3 opacity-40">
                <span className="text-sm">📖</span>
                <span className="text-[10px] uppercase tracking-widest text-[var(--luntian-text-muted)]">
                  {isFil ? 'Tagapagsalaysay' : 'Narrator'}
                </span>
              </div>
            )}

            <p className={`leading-relaxed ${
              isNarrator
                ? 'text-[var(--luntian-text-muted)] italic text-sm'
                : isGeneral
                  ? 'text-red-200 text-base'
                  : 'text-[var(--luntian-text)] text-base'
            }`}>
              {isNarrator ? '' : '"'}{displayedText}{isNarrator ? '' : isTyping ? '' : '"'}
              {isTyping && <span className="animate-pulse ml-0.5 text-[var(--luntian-primary)]">|</span>}
            </p>
          </div>

          {/* Controls */}
          <div className="text-center mt-3">
            <span className="text-[10px] text-[var(--luntian-text-muted)]/25">
              {isTyping
                ? (isFil ? '[ Click o Space para ipakita lahat ]' : '[ Click or Space to show all ]')
                : (isFil ? '[ Click o Space para magpatuloy ]' : '[ Click or Space to continue ]')}
            </span>
          </div>
        </div>

        {/* ═══ BATTLE TRANSITION ═══ */}
        {showBattle && currentScene.battleConfig && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/85">
            <div className="text-center p-10 rounded-2xl bg-[var(--luntian-surface)] border border-red-900/40 max-w-md animate-[scale-in_0.3s_ease-out]">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <h2 className="text-3xl font-black text-red-400 mb-2">
                {isFil ? 'LABAN!' : 'BATTLE!'}
              </h2>
              <p className="text-lg text-[var(--luntian-text-muted)] mb-1">
                {currentScene.battleConfig.guardian.charAt(0).toUpperCase() + currentScene.battleConfig.guardian.slice(1)}
                <span className="text-red-400 mx-2">VS</span>
                {currentScene.battleConfig.general.charAt(0).toUpperCase() + currentScene.battleConfig.general.slice(1)}
              </p>
              <p className="text-xs text-[var(--luntian-text-muted)]/50 mb-6">
                {isFil ? 'Handa ka na ba?' : 'Are you ready?'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/battle`) }}
                  className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all hover:scale-105 text-lg"
                >
                  ⚔️ {isFil ? 'Lumaban!' : 'Fight!'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowBattle(false)
                    if (sceneIdx < scenes.length - 1) {
                      setSceneIdx((p) => p + 1)
                      setDialogIdx(0)
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-[var(--luntian-surface)] border border-white/10 text-[var(--luntian-text-muted)] transition-all hover:border-white/30"
                >
                  {isFil ? 'Laktawan' : 'Skip'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CHAPTER COMPLETE ═══ */}
        {showChapterComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/85">
            <div className="text-center p-10 rounded-2xl bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/30 max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-black text-[var(--luntian-primary)] mb-2">
                {isFil ? 'Tapos na ang Kabanata!' : 'Chapter Complete!'}
              </h2>
              <p className="text-lg text-[var(--luntian-text)] mb-1">
                {isFil ? chapter.title_fil : chapter.title_en}
              </p>

              {/* Unlocks */}
              {chapter.unlocks && (
                <div className="mt-4 mb-6 space-y-1">
                  {chapter.unlocks.guardians?.map((g) => (
                    <div key={g} className="text-xs text-green-400">✨ {isFil ? 'Nagising' : 'Awakened'}: {g.charAt(0).toUpperCase() + g.slice(1)}</div>
                  ))}
                  {chapter.unlocks.regions?.map((r) => (
                    <div key={r} className="text-xs text-blue-400">🗺️ {isFil ? 'Na-unlock' : 'Unlocked'}: {r.replace(/_/g, ' ')}</div>
                  ))}
                  {chapter.unlocks.achievements?.map((a) => (
                    <div key={a} className="text-xs text-yellow-400">🏆 {a.replace(/_/g, ' ')}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {getNextChapter(chapter.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const next = getNextChapter(chapter.id)
                      if (next) navigate(`/story/${next.id}`)
                    }}
                    className="px-8 py-3 rounded-xl bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-bold transition-all hover:scale-105"
                  >
                    {isFil ? 'Susunod na Kabanata' : 'Next Chapter'} →
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/story') }}
                  className="px-6 py-3 rounded-xl bg-[var(--luntian-surface)] border border-white/10 text-[var(--luntian-text-muted)] transition-all hover:border-white/30"
                >
                  {isFil ? 'Bumalik' : 'Back'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}