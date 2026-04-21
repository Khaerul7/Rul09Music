'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { usePlayerStore, getActiveLyricIndex } from '@/store/usePlayerStore'
import { useAudioEngine, formatTime } from '@/hooks/useAudioEngine'
import { cn } from '@/lib/utils'

export function LyricsPanel() {
  const {
    currentTrack, showLyrics, isPlaying,
    currentTime, lyrics,
    closeLyrics, togglePlay, skipNext, skipPrev,
  } = usePlayerStore()

  const { seek } = useAudioEngine()
  const activeIndex = getActiveLyricIndex(lyrics, currentTime)
  const lyricsRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)
  const duration = currentTrack?.duration ?? 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeIndex])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  return (
    <AnimatePresence>
      {showLyrics && currentTrack && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          className="fixed inset-0 z-60 bg-zinc-950 flex flex-col"
        >
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between px-7 py-4 border-b border-white/4 shrink-0">
            <button
              type="button"
              onClick={closeLyrics}
              aria-label="Close lyrics"
              className="flex items-center gap-2 text-zinc-500 text-xs bg-white/4 border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X size={12} />
              Close
            </button>
            <span className="font-mono text-[9px] text-blue-500 tracking-[3px]">SYNCED LYRICS</span>
            <span className="font-mono text-[10px] text-zinc-600">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left panel */}
            <div className="w-64 shrink-0 flex flex-col items-center gap-4 p-6 border-r border-white/4">

              {/* Album art — pulsing when playing */}
              <motion.div
                animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48 h-48 rounded-[18px] shrink-0 relative overflow-hidden"
              >
                {currentTrack.cover ? (
                  <Image
                    src={currentTrack.cover}
                    alt={`${currentTrack.title} cover`}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: currentTrack.gradient }} />
                )}
              </motion.div>

              {/* Track info */}
              <div className="text-center">
                <p className="text-[16px] font-medium text-zinc-100">{currentTrack.title}</p>
                <p className="text-[12px] text-blue-400 font-mono tracking-wide mt-1">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Progress */}
              <div className="w-full">
                <div
                  className="w-full h-0.75 bg-white/6] rounded-full cursor-pointer mb-1.5 relative group/p"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-blue-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-950 opacity-0 group-hover/p:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-zinc-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={skipPrev}
                  aria-label="Previous track"
                  className="w-7 h-7 rounded-full border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <SkipBack size={12} />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-10.5 h-10.5 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors active:scale-95"
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={skipNext}
                  aria-label="Next track"
                  className="w-7 h-7 rounded-full border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <SkipForward size={12} />
                </button>
              </div>

              <p className="mt-auto font-['Bebas_Neue'] text-[10px] tracking-[4px] text-blue-900/60 select-none">
                RUL09
              </p>
            </div>

            {/* Lyrics scroll */}
            <div
              ref={lyricsRef}
              className="flex-1 overflow-y-auto py-16 flex flex-col items-center gap-1 scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {lyrics.filter((l) => l.text).map((line, i) => {
                const isPast  = i < activeIndex
                const isActive = i === activeIndex
                const isNear  = Math.abs(i - activeIndex) === 1

                return (
                  <motion.div
                    key={i}
                    ref={isActive ? activeRef : null}
                    onClick={() => seek(line.time)}
                    animate={{ scale: isActive ? 1 : isNear ? 0.97 : 0.92 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={cn(
                      'text-center px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 max-w-lg w-full',
                      isActive && 'bg-blue-500/[0.07] border border-blue-500/15',
                    )}
                  >
                    <span
                      className={cn(
                        'transition-all duration-300 leading-relaxed',
                        isActive  ? 'text-[20px] font-medium text-zinc-100'
                        : isNear  ? 'text-[16px] font-normal text-zinc-400'
                        : isPast  ? 'text-[13px] text-zinc-700'
                        :           'text-[15px] text-zinc-600',
                      )}
                    >
                      {line.text}
                    </span>
                  </motion.div>
                )
              })}
              <div className="h-40 shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
