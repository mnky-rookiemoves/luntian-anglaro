/**
 * 📖 LUNTIAN ANGLARO — Story Mode
 * Chapter selector with progress tracking, saga tabs,
 * and chapter cards showing unlock status.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SAGAS, type StoryChapter } from '@/data/storyData'
import { ELEMENT_CONFIG } from '@/types/game.types'
import { useGameStore } from '@/store'

export default function StoryModePage() {
  const navigate = useNavigate()
  const { language } = useGameStore()
  const [activeSaga, setActiveSaga] = useState(1)
  const isFil = language === 'fil'

  // Load progress from localStorage
  const completedChapters: string[] = JSON.parse(
    localStorage.getItem('luntian_completed_chapters') || '[]'
  )
  const currentChapterId = localStorage.getItem('luntian_current_chapter') || 'prologue'

  const saga = SAGAS.find((s) => s.id === activeSaga)
  const chapters = saga?.chapters || []

  // Calculate progress
  const totalChapters = chapters.length
  const completed = chapters.filter((c) => completedChapters.includes(c.id)).length
  const progressPercent = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0

  // A chapter is unlocked if: it's the prologue, OR the previous chapter is completed
  const isUnlocked = (chapter: StoryChapter, index: number): boolean => {
    if (chapter.id === 'prologue') return true
    if (index === 0) return true
    const prevChapter = chapters[index - 1]
    return completedChapters.includes(prevChapter?.id)
  }

  const THREAT_COLORS: Record<string, string> = {
    usok: '#78909C', mantsa: '#7B1FA2', hukay: '#FF6D00',
    putol: '#FF8F00', lason: '#00897B', ang_dumi: '#D50000',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[var(--luntian-primary)] mb-2">
          📖 {isFil ? 'Kwento ng Luntian' : 'Story Mode'}
        </h1>
        <p className="text-[var(--luntian-text-muted)]">
          {isFil
            ? 'Ang pakikipagsapalaran ng mga Tagapag-alaga ng Kalikasan'
            : 'The adventure of the Guardians of the Environment'}
        </p>
      </div>

      {/* Saga Tabs */}
      <div className="flex gap-3 mb-6 justify-center">
        {SAGAS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSaga(s.id)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeSaga === s.id
                ? 'bg-[var(--luntian-primary)] text-white scale-105'
                : 'bg-[var(--luntian-surface)] text-[var(--luntian-text-muted)] border border-[var(--luntian-primary)]/20 hover:border-[var(--luntian-primary)]/50'
            }`}
          >
            <div className="text-sm">Saga {s.id}</div>
            <div className="text-xs opacity-70">
              {isFil ? s.title_fil : s.title_en}
            </div>
          </button>
        ))}
      </div>

      {/* Saga Title */}
      {saga && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--luntian-text)]">
            Saga {saga.id}: {isFil ? saga.title_fil : saga.title_en}
          </h2>
          <p className="text-sm text-[var(--luntian-text-muted)] italic">
            {isFil ? saga.subtitle_fil : saga.subtitle_en}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="flex justify-between text-xs text-[var(--luntian-text-muted)] mb-1">
          <span>{completed}/{totalChapters} {isFil ? 'Kabanata' : 'Chapters'}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-[var(--luntian-primary)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Saga II Coming Soon */}
      {activeSaga === 2 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold text-red-400 mb-2">
            Saga II: {isFil ? 'Ang Pagkabulok' : 'The Decay'}
          </h3>
          <p className="text-[var(--luntian-text-muted)] mb-2">
            {isFil ? 'Ang Digmaan sa Loob' : 'The War Within'}
          </p>
          <p className="text-sm text-[var(--luntian-text-muted)]/60 italic">
            {isFil ? 'Malapit na...' : 'Coming Soon...'}
          </p>
        </div>
      )}

      {/* Chapter Timeline */}
      {activeSaga === 1 && (
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[var(--luntian-primary)]/20" />

          <div className="space-y-4">
            {chapters.map((chapter, index) => {
              const unlocked = isUnlocked(chapter, index)
              const isCompleted = completedChapters.includes(chapter.id)
              const isCurrent = chapter.id === currentChapterId
              const enemyColor = chapter.enemy ? THREAT_COLORS[chapter.enemy] || '#EF5350' : undefined

              return (
                <div
                  key={chapter.id}
                  onClick={() => {
                    if (unlocked) navigate(`/story/${chapter.id}`)
                  }}
                  className={`relative pl-20 pr-6 py-5 rounded-2xl border transition-all duration-300 ${
                    unlocked
                      ? 'cursor-pointer hover:scale-[1.01] hover:border-[var(--luntian-primary)]/50'
                      : 'opacity-40 cursor-not-allowed'
                  } ${
                    isCurrent
                      ? 'border-[var(--luntian-primary)]/60 bg-[var(--luntian-primary)]/8'
                      : isCompleted
                        ? 'border-green-800/30 bg-green-950/10'
                        : 'border-[var(--luntian-primary)]/15 bg-[var(--luntian-surface)]'
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] ${
                      isCompleted
                        ? 'bg-green-500 border-green-400 text-white'
                        : isCurrent
                          ? 'bg-[var(--luntian-primary)] border-[var(--luntian-primary-light)] text-white animate-pulse'
                          : unlocked
                            ? 'bg-[var(--luntian-surface)] border-[var(--luntian-primary)]/40'
                            : 'bg-[var(--luntian-surface)] border-gray-700'
                    }`}
                  >
                    {isCompleted ? '✓' : unlocked ? chapter.chapterNumber : '🔒'}
                  </div>

                  {/* Chapter content */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Chapter number & title */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--luntian-text-muted)]/60 uppercase tracking-wider">
                          {chapter.chapterNumber === 0 ? (isFil ? 'Panimula' : 'Prologue') : `${isFil ? 'Kabanata' : 'Chapter'} ${chapter.chapterNumber}`}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--luntian-primary)]/20 text-[var(--luntian-primary)] font-bold">
                            {isFil ? 'KASALUKUYAN' : 'CURRENT'}
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 font-bold">
                            {isFil ? 'TAPOS NA' : 'COMPLETED'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[var(--luntian-text)] mb-0.5">
                        {isFil ? chapter.title_fil : chapter.title_en}
                      </h3>
                      <p className="text-xs text-[var(--luntian-text-muted)] italic mb-2">
                        {isFil ? chapter.subtitle_fil : chapter.subtitle_en}
                      </p>

                      {/* Summary */}
                      <p className="text-xs text-[var(--luntian-text-muted)]/70 leading-relaxed mb-3">
                        {isFil ? chapter.summary_fil : chapter.summary_en}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--luntian-primary)]/10 text-[var(--luntian-primary)] border border-[var(--luntian-primary)]/20">
                          {isFil ? chapter.theme_fil : chapter.theme_en}
                        </span>
                        {chapter.guardian && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-800/30">
                            🛡️ {isFil ? 'Gigisingin' : 'Awakens'}: {chapter.guardian.charAt(0).toUpperCase() + chapter.guardian.slice(1)}
                          </span>
                        )}
                        {chapter.enemy && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded border"
                            style={{
                              backgroundColor: (enemyColor || '#EF5350') + '15',
                              borderColor: (enemyColor || '#EF5350') + '30',
                              color: enemyColor || '#EF5350',
                            }}
                          >
                            💀 Boss: {chapter.enemy.charAt(0).toUpperCase() + chapter.enemy.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quote */}
                    {chapter.quote_en && unlocked && (
                      <div className="hidden lg:block w-48 text-right">
                        <p className="text-[10px] text-[var(--luntian-text-muted)]/40 italic leading-relaxed">
                          "{isFil ? chapter.quote_fil : chapter.quote_en}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}