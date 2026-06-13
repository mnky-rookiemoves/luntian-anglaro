import { useState, useEffect } from 'react'

const HomePage = () => {
  const [glowIntensity, setGlowIntensity] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: 'var(--luntian-primary-light)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {/* Leaf icon */}
        <div
          className="text-7xl mb-6 inline-block"
          style={{
            filter: `drop-shadow(0 0 ${10 + Math.sin(glowIntensity * 0.05) * 5}px var(--luntian-primary-light))`,
          }}
        >
          🌿
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">
          <span className="text-[var(--luntian-primary-light)]">LUNTIAN</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-1 tracking-[0.3em] uppercase text-[var(--luntian-text-muted)]">
          Ang Laro
        </h2>
        <p className="text-sm md:text-base text-[var(--luntian-text-muted)] mb-8 italic">
          Guardians of the Environment
        </p>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-[var(--luntian-gold)] font-medium mb-12">
          "Luntiang Puso, Luntiang Gawa"
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-[var(--luntian-primary)] hover:bg-[var(--luntian-primary-light)] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_var(--luntian-primary)]">
            ⚔️ Maglaro (Play)
          </button>
          <button className="px-8 py-3 border border-[var(--luntian-primary)] text-[var(--luntian-primary-light)] hover:bg-[var(--luntian-primary)]/10 font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            📖 Ang Kwento (Story)
          </button>
        </div>

        {/* Version badge */}
        <div className="mt-16 text-xs text-[var(--luntian-text-muted)]/50">
          v0.1.0 — Phase 0 Scaffold • Built with 💚 by Sensei & Master
        </div>
      </div>
    </div>
  )
}

export default HomePage