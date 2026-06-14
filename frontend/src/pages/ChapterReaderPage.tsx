/**
 * 📖 LUNTIAN ANGLARO — Chapter Reader
 * Visual novel-style narrative reader with dialogue boxes,
 * character names, emotions, battle transitions, and awakenings.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChapter, getNextChapter, type StoryScene, type StoryDialogue } from '@/data/storyData'
import { useGameStore } from '@/store'

const SPEAKER_COLORS: Record<string, string> = {
  narrator: '#9E9E9E',
  luntian: '#4CAF50',
  player: '#64B5F6',
  alon: '#2196F3',
  bulkan: '#FF5722',
  haribon: '#8BC34A',
  pawikan: '#FFB300',
  usok: '#78909C',
  mantsa: '#7B1FA2',
  hukay: '#FF6D00',
  putol: '#FF8F00',
  lason: '#00897B',
  'ang dumi': '#D50000',
  '???': '#EF5350',
}

const SPEAKER_EMOJIS: Record<string, string> = {
  narrator: '📖',
  luntian: '🌿',
  player: '👤',
  alon: '🌊',
  bulkan: '🌋',
  haribon: '🦅',
  pawikan: '🐢',
  usok: '💨',
  mantsa: '🏭',
  hukay: '⛏️',
  putol: '🪓',
  lason: '☠️',
  'ang dumi': '💀',
  '???': '❓',
}

export default function ChapterReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const navigate = useNavigate()
  const { language } = useGameStore()
  const isFil = language === 'fil'

  const chapter = chapterId ? getChapter(chapterId) : undefined
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedText, setDisplayedText] = useState('')
  const [showBattleTransition, setShowBattleTransition] = useState(false)

  if (!chapter) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Chapter not found.</p>
        <button onClick={() => navigate('/story')} className="mt-4 text-[var(--luntian-primary)] underline">
          Back to Story
        </button>
      </div>
    )
  }

  const scenes = chapter.scenes
  const currentScene = scenes[currentSceneIndex]
  const currentDialogue = currentScene?.dialogues[currentDialogueIndex]

  // Typewriter effect
  useEffect(() => {
    if (!currentDialogue) return
    const fullText = isFil ? currentDialogue.text_fil : currentDialogue.text_en
    setIsTyping(true)
    setDisplayedText('')

    let i = 0
    const speed = 20 // ms per character
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [currentSceneIndex, currentDialogueIndex, isFil, currentDialogue])

  const handleAdvance = () => {
    if (!currentScene || !currentDialogue) return

    // If still typing, show full text immediately
    if (isTyping) {
      setIsTyping(false)
      const fullText = isFil ? currentDialogue.text_fil : currentDialogue.text_en
      setDisplayedText(fullText)
      return
    }

    // Move to next dialogue in current scene
    if (currentDialogueIndex < currentScene.dialogues.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1)
      return
    }

    // Scene complete — check for battle transition
    if (currentScene.type === 'battle' && currentScene.battleConfig) {
      setShowBattleTransition(true)
      return
    }

    // Move to next scene
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1)
      setCurrentDialogueIndex(0)
      return
    }

    // Chapter complete!
    const completed: string[] = JSON.parse(localStorage.getItem('luntian_completed_chapters') || '[]')
    if (!completed.includes(chapter.id)) {
      completed.push(chapter.id)
      localStorage.setItem('luntian_completed_chapters', JSON.stringify(completed))
    }

    // Set next chapter as current
    const nextChapter = getNextChapter(chapter.id)
    if (nextChapter) {
      localStorage.setItem('luntian_current_chapter', nextChapter.id)
    }

    navigate('/story')
  }

  const handleBattle = () => {
    if (currentScene?.battleConfig) {
      navigate(`/battle?guardian=${currentScene.battleConfig.guardian}&general=${currentScene.battleConfig.general}&story=true&chapter=${chapter.id}&scene=${currentSceneIndex}`)
    }
  }

  const handleSkipBattle = () => {
    setShowBattleTransition(false)
    // Move past the battle scene
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1)
      setCurrentDialogueIndex(0)
    }
  }

  if (!currentDialogue) return null

  const speakerName = currentDialogue.speakerName || currentDialogue.speaker
  const speakerKey = speakerName.toLowerCase()
  const speakerColor = SPEAKER_COLORS[speakerKey] || '#9E9E9E'
  const speakerEmoji = SPEAKER_EMOJIS[speakerKey] || '💬'

  // Scene type indicators
  const sceneTypeConfig: Record<string, { label: string; color: string }> = {
    narration: { label: '📖 Narration', color: '#9E9E9E' },
    dialogue: { label: '💬 Dialogue', color: '#64B5F6' },
    battle: { label: '⚔️ Battle', color: '#EF5350' },
    awakening: { label: '✨ Awakening', color: '#FFD600' },
    cutscene: { label: '🎬 Cutscene', color: '#CE93D8' },
    exploration: { label: '🗺️ Exploration', color: '#4CAF50' },
    choice: { label: '🔀 Choice', color: '#FF9800' },
  }

  const sceneConfig = sceneTypeConfig[currentScene.type] || sceneTypeConfig.narration

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#050a05] overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-[var(--luntian-primary)]/10 flex-shrink-0">
        <button
          onClick={() => navigate('/story')}
          className="text-xs text-[var(--luntian-text-muted)] hover:text-[var(--luntian-primary)] transition-colors"
        >
          ← {isFil ? 'Bumalik' : 'Back'}
        </button>
        <div className="text-center">
          <span className="text-[10px] text-[var(--luntian-text-muted)]/60 uppercase tracking-widest">
            {chapter.chapterNumber === 0 ? (isFil ? 'Panimula' : 'Prologue') : `${isFil ? 'Kabanata' : 'Chapter'} ${chapter.chapterNumber}`}
          </span>
          <span className="text-xs text-[var(--luntian-text)] font-bold ml-2">
            {isFil ? chapter.title_fil : chapter.title_en}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: sceneConfig.color }}>
          {sceneConfig.label}
        </span>
      </div>

      {/* ── Scene Progress ── */}
      <div className="w-full bg-black/30 h-1 flex-shrink-0">
        <div
          className="h-1 bg-[var(--luntian-primary)] transition-all duration-300"
          style={{ width: `${((currentSceneIndex * 10 + currentDialogueIndex) / (scenes.length * 5)) * 100}%` }}
        />
      </div>

      {/* ── Main Visual Area ── */}
      <div
        className="flex-1 flex items-end justify-center px-4 pb-4 relative"
        onClick={showBattleTransition ? undefined : handleAdvance}
        style={{ cursor: showBattleTransition ? 'default' : 'pointer' }}
      >
        {/* Background atmosphere based on scene type */}
        <div className="absolute inset-0 pointer-events-none">
          {currentScene.type === 'awakening' && (
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent animate-pulse" />
          )}
          {currentScene.type === 'battle' && (
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
          )}
          {currentScene.type === 'cutscene' && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/15 to-transparent" />
          )}
        </div>

        {/* Battle Transition Overlay */}
        {showBattleTransition && currentScene.battleConfig && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
            <div className="text-center p-8 rounded-2xl bg-[var(--luntian-surface)] border border-red-900/40 max-w-md">
              <div className="text-5xl mb-4">⚔️</div>
              <h2 className="text-2xl font-black text-red-400 mb-2">
                {isFil ? 'LABAN!' : 'BATTLE!'}
              </h2>
              <p className="text-sm text-[var(--luntian-text-muted)] mb-6">
                {isFil
                  ? `${currentScene.battleConfig.guardian.charAt(0).toUpperCase() + currentScene.battleConfig.guardian.slice(1)} vs ${currentScene.battleConfig.general.charAt(0).toUpperCase() + currentScene.battleConfig.general.slice(1)}`
                  : `${currentScene.battleConfig.guardian.charAt(0).toUpperCase() + currentScene.battleConfig.guardian.slice(1)} vs ${currentScene.battleConfig.general.charAt(0).toUpperCase() + currentScene.battleConfig.general.slice(1)}`}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleBattle}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all hover:scale-105"
                >
                  ⚔️ {isFil ? 'Lumaban!' : 'Fight!'}
                </button>
                <button
                  onClick={handleSkipBattle}
                  className="px-6 py-2.5 rounded-xl bg-[var(--luntian-surface)] border border-[var(--luntian-primary)]/30 text-[var(--luntian-text-muted)] font-medium transition-all hover:border-[var(--luntian-primary)]/60"
                >
                  {isFil ? 'Laktawan' : 'Skip'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dialogue Box */}
        <div className="w-full max-w-3xl z-10">
          {/* Speaker */}
          {currentDialogue.speaker !== 'narrator' && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{speakerEmoji}</span>
              <span className="font-bold text-sm" style={{ color: speakerColor }}>
                {speakerName === 'player' ? (isFil ? 'Ikaw' : 'You') : speakerName}
              </span>
              {currentDialogue.emotion && currentDialogue.emotion !== 'neutral' && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--luntian-text-muted)]/40 italic">
                  {currentDialogue.emotion}
                </span>
              )}
            </div>
          )}

          {/* Text Box */}
          <div
            className={`rounded-xl p-5 border backdrop-blur-sm ${
              currentDialogue.speaker === 'narrator'
                ? 'bg-black/60 border-white/10 italic'
                : currentDialogue.speaker === 'general'
                  ? 'bg-red-950/40 border-red-900/30'
                  : 'bg-[var(--luntian-surface)]/80 border-[var(--luntian-primary)]/20'
            }`}
          >
            <p className={`text-sm leading-relaxed ${
              currentDialogue.speaker === 'narrator' ? 'text-[var(--luntian-text-muted)]' : 'text-[var(--luntian-text)]'
            }`}>
              {displayedText}
              {isTyping && <span className="animate-pulse ml-0.5">|</span>}
            </p>
          </div>

          {/* Controls hint */}
          <div className="text-center mt-2">
            <span className="text-[9px] text-[var(--luntian-text-muted)]/30">
              {isTyping
                ? (isFil ? 'I-click para ipakita lahat' : 'Click to show all')
                : (isFil ? 'I-click para magpatuloy' : 'Click to continue')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Info ── */}
      <div className="px-4 py-2 bg-black/30 border-t border-[var(--luntian-primary)]/5 flex justify-between items-center flex-shrink-0">
        <span className="text-[9px] text-[var(--luntian-text-muted)]/30">
          {isFil ? 'Eksena' : 'Scene'} {currentSceneIndex + 1}/{scenes.length}
        </span>
        <span className="text-[9px] text-[var(--luntian-text-muted)]/30">
          {isFil ? chapter.theme_fil : chapter.theme_en}
        </span>
      </div>
    </div>
  )
}