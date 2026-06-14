/**
 * 📖 LUNTIAN ANGLARO — Chapter Reader v2
 * Centered dialogue, scene illustrations, TTS voiceover,
 * and immersive visual novel experience.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChapter, getNextChapter } from '@/data/storyData'

/* ═══════════════════════════════════════════════
   SOUND ENGINE
   ═══════════════════════════════════════════════ */
class StoryAudio {
  private ctx: AudioContext | null = null
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    return this.ctx
  }
  tick() { try { const c=this.getCtx(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=800+Math.random()*400;o.type='sine';g.gain.setValueAtTime(0.02,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.05);o.start(c.currentTime);o.stop(c.currentTime+0.05)} catch{} }
  advance() { try { const c=this.getCtx(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=600;o.type='triangle';g.gain.setValueAtTime(0.06,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.12);o.start(c.currentTime);o.stop(c.currentTime+0.12)} catch{} }
  awakening() { try { const c=this.getCtx();[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type='sine';const t=c.currentTime+i*0.15;g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);o.start(t);o.stop(t+0.4)})} catch{} }
  battleAlert() { try { const c=this.getCtx();for(let i=0;i<3;i++){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=200+i*100;o.type='sawtooth';const t=c.currentTime+i*0.12;g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2)}} catch{} }
  generalWhisper() { try { const c=this.getCtx(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=120;o.type='sawtooth';g.gain.setValueAtTime(0.03,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.8);o.start(c.currentTime);o.stop(c.currentTime+0.8)} catch{} }
  fanfare() { try { const c=this.getCtx();[523,659,784,880,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type='triangle';const t=c.currentTime+i*0.12;g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5)})} catch{} }
}
const audio = new StoryAudio()

/* ═══════════════════════════════════════════════
   TTS VOICEOVER ENGINE
   ═══════════════════════════════════════════════ */
class VoiceOver {
  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  private speaking = false
  enabled = true

  speak(text: string, speaker: string) {
    if (!this.synth || !this.enabled) return
    this.stop()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = speaker === 'narrator' ? 0.85 : 0.95
    utterance.pitch = speaker === 'general' ? 0.6 : speaker === 'narrator' ? 0.9 : 1.1
    utterance.volume = 0.7
    this.speaking = true
    utterance.onend = () => { this.speaking = false }
    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
      this.speaking = false
    }
  }

  isSpeaking() { return this.speaking }
}
const voice = new VoiceOver()

/* ═══════════════════════════════════════════════
   SPEAKER CONFIG
   ═══════════════════════════════════════════════ */
const SPEAKERS: Record<string, { color: string; emoji: string; illustration: string }> = {
  narrator:   { color: '#B0BEC5', emoji: '📖', illustration: '🌏' },
  luntian:    { color: '#4CAF50', emoji: '🌿', illustration: '🌱' },
  player:     { color: '#64B5F6', emoji: '👤', illustration: '🧑' },
  alon:       { color: '#2196F3', emoji: '🌊', illustration: '🌊' },
  bulkan:     { color: '#FF5722', emoji: '🌋', illustration: '🌋' },
  haribon:    { color: '#8BC34A', emoji: '🦅', illustration: '🦅' },
  pawikan:    { color: '#FFB300', emoji: '🐢', illustration: '🐢' },
  usok:       { color: '#90A4AE', emoji: '💨', illustration: '🏭' },
  mantsa:     { color: '#CE93D8', emoji: '🏭', illustration: '🛢️' },
  hukay:      { color: '#FF9800', emoji: '⛏️', illustration: '⛏️' },
  putol:      { color: '#FF8F00', emoji: '🪓', illustration: '🪓' },
  lason:      { color: '#26A69A', emoji: '☠️', illustration: '🌊' },
  'ang dumi': { color: '#EF5350', emoji: '💀', illustration: '💀' },
  '???':      { color: '#EF5350', emoji: '❓', illustration: '🕳️' },
}

/* ═══════════════════════════════════════════════
   SCENE BACKGROUNDS
   ═══════════════════════════════════════════════ */
const SCENE_BG: Record<string, string> = {
  narration:   'from-[#030a03] via-[#050d05] to-[#030a03]',
  dialogue:    'from-[#030a03] via-[#061006] to-[#030a03]',
  exploration: 'from-[#030a03] via-[#040d08] to-[#030a03]',
  awakening:   'from-[#030a03] via-[#082010] to-[#030a03]',
  battle:      'from-[#0a0303] via-[#150505] to-[#0a0303]',
  cutscene:    'from-[#050310] via-[#0a0520] to-[#050310]',
  choice:      'from-[#0a0a03] via-[#151505] to-[#0a0a03]',
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
export default function ChapterReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const navigate = useNavigate()

  const isFil = localStorage.getItem('luntian_language') === 'fil'
  const chapter = chapterId ? getChapter(chapterId) : undefined

  const [sceneIdx, setSceneIdx] = useState(0)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showBattle, setShowBattle] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const tickCounter = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fade in on scene change
  useEffect(() => {
    setFadeIn(false)
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [sceneIdx, dialogIdx])

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#030a03] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-red-400 mb-4">Chapter not found</p>
          <button onClick={() => navigate('/story')} className="px-6 py-2 bg-[var(--luntian-primary)] text-white rounded-lg">Back</button>
        </div>
      </div>
    )
  }

  const scenes = chapter.scenes
  const scene = scenes[sceneIdx]
  const dialog = scene?.dialogues?.[dialogIdx]

  // Typewriter + TTS
  useEffect(() => {
    if (!dialog) return
    const fullText = isFil ? dialog.text_fil : dialog.text_en
    setDisplayedText('')
    setIsTyping(true)
    tickCounter.current = 0

    if (dialog.speaker === 'general') audio.generalWhisper()
    if (scene?.type === 'awakening') audio.awakening()

    // TTS voiceover
    voice.enabled = voiceEnabled
    voice.speak(fullText, dialog.speaker)

    let i = 0
    timerRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1))
        i++
        tickCounter.current++
        if (tickCounter.current % 4 === 0) audio.tick()
      } else {
        setIsTyping(false)
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, 22)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [sceneIdx, dialogIdx])

  const handleAdvance = useCallback(() => {
    if (showBattle || showComplete) return

    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current)
      const fullText = isFil ? dialog?.text_fil || '' : dialog?.text_en || ''
      setDisplayedText(fullText)
      setIsTyping(false)
      voice.stop()
      return
    }

    audio.advance()
    voice.stop()

    if (scene && dialogIdx < scene.dialogues.length - 1) {
      setDialogIdx(p => p + 1)
      return
    }

    if (scene?.type === 'battle' && scene.battleConfig) {
      audio.battleAlert()
      setShowBattle(true)
      return
    }

    if (sceneIdx < scenes.length - 1) {
      setSceneIdx(p => p + 1)
      setDialogIdx(0)
      return
    }

    // Chapter complete
    audio.fanfare()
    voice.stop()
    const completed: string[] = JSON.parse(localStorage.getItem('luntian_completed_chapters') || '[]')
    if (!completed.includes(chapter.id)) {
      completed.push(chapter.id)
      localStorage.setItem('luntian_completed_chapters', JSON.stringify(completed))
    }
    const next = getNextChapter(chapter.id)
    if (next) localStorage.setItem('luntian_current_chapter', next.id)
    setShowComplete(true)
  }, [isTyping, dialogIdx, sceneIdx, scenes.length, scene, dialog, isFil, chapter.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleAdvance() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleAdvance])

  if (!dialog) return null

  const speakerName = dialog.speakerName || dialog.speaker
  const speakerKey = speakerName.toLowerCase()
  const spk = SPEAKERS[speakerKey] || SPEAKERS.narrator
  const isNarrator = dialog.speaker === 'narrator'
  const isGeneral = dialog.speaker === 'general'
  const isGuardian = dialog.speaker === 'guardian'
  const isAwakening = scene.type === 'awakening'
  const bgGradient = SCENE_BG[scene.type] || SCENE_BG.narration

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col overflow-hidden`}
      onClick={showBattle || showComplete ? undefined : handleAdvance}
      style={{ cursor: showBattle || showComplete ? 'default' : 'pointer' }}
    >
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/50 border-b border-white/5 flex-shrink-0 z-20">
        <button onClick={(e) => { e.stopPropagation(); voice.stop(); navigate('/story') }}
          className="text-xs text-white/30 hover:text-white/60 transition-colors">
          ← {isFil ? 'Bumalik' : 'Back'}
        </button>
        <div className="text-center">
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] mr-2">
            {chapter.chapterNumber === 0 ? 'Prologue' : `Ch.${chapter.chapterNumber}`}
          </span>
          <span className="text-xs text-white/70 font-semibold">
            {isFil ? chapter.title_fil : chapter.title_en}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setVoiceEnabled(!voiceEnabled); voice.stop() }}
            className={`text-sm transition-opacity ${voiceEnabled ? 'opacity-100' : 'opacity-30'}`}
            title={voiceEnabled ? 'Mute voiceover' : 'Enable voiceover'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <span className="text-[10px] text-white/20">{sceneIdx + 1}/{scenes.length}</span>
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="w-full bg-black/30 h-0.5 flex-shrink-0">
        <div className="h-0.5 bg-[var(--luntian-primary)] transition-all duration-500"
          style={{ width: `${((sceneIdx + dialogIdx / (scene?.dialogues.length || 1)) / scenes.length) * 100}%` }} />
      </div>

      {/* ═══ MAIN CONTENT — CENTERED ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">

        {/* Awakening particles */}
        {isAwakening && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-green-400/30 animate-ping"
                style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*3}s`, animationDuration: `${2+Math.random()*2}s` }} />
            ))}
          </div>
        )}

        {/* ── SCENE ILLUSTRATION (Center) ── */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto
            ${isGeneral ? 'bg-red-900/20 border border-red-900/30 shadow-[0_0_40px_rgba(239,83,80,0.15)]' :
              isAwakening ? 'bg-green-900/20 border border-green-700/30 shadow-[0_0_40px_rgba(76,175,80,0.2)] animate-pulse' :
              isGuardian ? 'bg-green-900/15 border border-green-800/20 shadow-[0_0_30px_rgba(76,175,80,0.1)]' :
              scene.type === 'cutscene' ? 'bg-purple-900/15 border border-purple-800/20 shadow-[0_0_30px_rgba(156,39,176,0.1)]' :
              'bg-white/5 border border-white/10'}`}
          >
            {spk.illustration}
          </div>

          {/* Scene type label */}
          {scene.type !== 'narration' && scene.type !== 'dialogue' && (
            <div className="text-center mt-3">
              <span className={`text-[10px] px-3 py-1 rounded-full border
                ${isAwakening ? 'bg-green-900/20 text-green-400 border-green-800/30' :
                  scene.type === 'battle' ? 'bg-red-900/20 text-red-400 border-red-800/30' :
                  scene.type === 'cutscene' ? 'bg-purple-900/20 text-purple-400 border-purple-800/30' :
                  'bg-white/5 text-white/40 border-white/10'}`}
              >
                {isAwakening ? '✨ Guardian Awakening' :
                 scene.type === 'battle' ? '⚔️ Battle' :
                 scene.type === 'cutscene' ? '🎬 Cutscene' :
                 scene.type === 'exploration' ? '🗺️ Exploration' : ''}
              </span>
            </div>
          )}
        </div>

        {/* ── Opening Quote (first scene only) ── */}
        {sceneIdx === 0 && dialogIdx === 0 && chapter.quote_en && (
          <div className={`text-center mb-6 max-w-lg transition-all duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs text-white/15 italic">
              "{isFil ? chapter.quote_fil : chapter.quote_en}"
            </p>
          </div>
        )}

        {/* ═══ DIALOGUE BOX — CENTERED ═══ */}
        <div className={`w-full max-w-2xl transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Speaker Name */}
          {!isNarrator && (
            <div className="flex items-center gap-2 mb-2 ml-3">
              <span className="text-lg">{spk.emoji}</span>
              <span className="font-bold text-sm" style={{ color: spk.color }}>
                {speakerName === 'player' ? (isFil ? 'Ikaw' : 'You') : speakerName}
              </span>
              {dialog.emotion && dialog.emotion !== 'neutral' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/20 italic">
                  {dialog.emotion}
                </span>
              )}
            </div>
          )}

          {/* Text Box */}
          <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-colors duration-300
            ${isNarrator ? 'bg-black/50 border-white/8' :
              isGeneral ? 'bg-red-950/40 border-red-900/30 shadow-[0_0_40px_rgba(239,83,80,0.08)]' :
              isAwakening ? 'bg-green-950/30 border-green-700/25 shadow-[0_0_40px_rgba(76,175,80,0.1)]' :
              'bg-[#0a1a0a]/70 border-[var(--luntian-primary)]/15'}`}
          >
            {isNarrator && (
              <div className="flex items-center gap-2 mb-3 opacity-30">
                <span className="text-xs">📖</span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-white/50">
                  {isFil ? 'Tagapagsalaysay' : 'Narrator'}
                </span>
              </div>
            )}

            <p className={`leading-[1.8] ${
              isNarrator ? 'text-white/60 italic text-[15px]' :
              isGeneral ? 'text-red-200/90 text-base' :
              'text-white/85 text-base'}`}
            >
              {!isNarrator && '"'}{displayedText}{!isNarrator && !isTyping && '"'}
              {isTyping && <span className="animate-pulse ml-0.5 text-[var(--luntian-primary)]">|</span>}
            </p>
          </div>

          {/* Advance hint */}
          <div className="text-center mt-4">
            <span className="text-[10px] text-white/15">
              {isTyping
                ? (isFil ? '[ Click o Space — ipakita lahat ]' : '[ Click or Space — show all ]')
                : (isFil ? '[ Click o Space — magpatuloy ]' : '[ Click or Space — continue ]')}
            </span>
          </div>
        </div>

        {/* ═══ BATTLE TRANSITION ═══ */}
        {showBattle && scene.battleConfig && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/90">
            <div className="text-center p-10 rounded-2xl bg-[var(--luntian-surface)] border border-red-900/40 max-w-md">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <h2 className="text-3xl font-black text-red-400 mb-2">{isFil ? 'LABAN!' : 'BATTLE!'}</h2>
              <p className="text-lg text-white/60 mb-1">
                <span style={{ color: SPEAKERS[scene.battleConfig.guardian]?.color }}>{scene.battleConfig.guardian.charAt(0).toUpperCase() + scene.battleConfig.guardian.slice(1)}</span>
                <span className="text-red-400 mx-2">VS</span>
                <span className="text-red-400">{scene.battleConfig.general.charAt(0).toUpperCase() + scene.battleConfig.general.slice(1)}</span>
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button onClick={(e) => { e.stopPropagation(); navigate('/battle') }}
                  className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all hover:scale-105 text-lg">
                  ⚔️ {isFil ? 'Lumaban!' : 'Fight!'}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowBattle(false); if(sceneIdx<scenes.length-1){setSceneIdx(p=>p+1);setDialogIdx(0)} }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/40 transition-all hover:border-white/30">
                  {isFil ? 'Laktawan' : 'Skip'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CHAPTER COMPLETE ═══ */}
        {showComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/90">
            <div className="text-center p-10 rounded-2xl bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/30 max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-black text-[var(--luntian-primary)] mb-2">
                {isFil ? 'Tapos na ang Kabanata!' : 'Chapter Complete!'}
              </h2>
              <p className="text-lg text-white/70 mb-1">{isFil ? chapter.title_fil : chapter.title_en}</p>
              {chapter.unlocks && (
                <div className="mt-4 mb-6 space-y-1.5">
                  {chapter.unlocks.guardians?.map(g => <div key={g} className="text-xs text-green-400">✨ Awakened: {g}</div>)}
                  {chapter.unlocks.regions?.map(r => <div key={r} className="text-xs text-blue-400">🗺️ Unlocked: {r.replace(/_/g,' ')}</div>)}
                  {chapter.unlocks.achievements?.map(a => <div key={a} className="text-xs text-yellow-400">🏆 {a.replace(/_/g,' ')}</div>)}
                </div>
              )}
              <div className="flex gap-3 justify-center">
                {getNextChapter(chapter.id) && (
                  <button onClick={(e) => { e.stopPropagation(); const n=getNextChapter(chapter.id); if(n) navigate(`/story/${n.id}`) }}
                    className="px-8 py-3 rounded-xl bg-[var(--luntian-primary)] text-white font-bold transition-all hover:scale-105">
                    {isFil ? 'Susunod' : 'Next Chapter'} →
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); navigate('/story') }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/40 hover:border-white/30">
                  {isFil ? 'Bumalik' : 'Back'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom ── */}
      <div className="px-4 py-2 flex justify-between items-center flex-shrink-0 opacity-20">
        <span className="text-[9px] text-white">{isFil ? chapter.theme_fil : chapter.theme_en}</span>
        <span className="text-[9px] text-white">LUNTIAN ANGLARO</span>
      </div>
    </div>
  )
}