'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Volume2, MessageSquare, Heart,
} from 'lucide-react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { useAudioEngine, formatTime } from '@/hooks/useAudioEngine'
import { cn } from '@/lib/utils'

export function MusicPlayer() {
  const {
    currentTrack, isPlaying, currentTime, volume,
    isShuffle, isRepeat,
    togglePlay, skipNext, skipPrev,
    toggleShuffle, toggleRepeat,
    setVolume, toggleLyrics,
  } = usePlayerStore()

  const { seek } = useAudioEngine()
  if (!currentTrack) return null

  const duration = currentTrack.duration
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setVolume((e.clientX - rect.left) / rect.width)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-500/15 bg-zinc-950/90 backdrop-blur-2xl px-7 pt-2.5 pb-2"
      >
        <div className="flex items-center gap-4">

          {/* ── Track info ── */}
          <div className="flex items-center gap-2.5 w-48 shrink-0">
            {/* Album art */}
            <div className="w-9.5 h-9.5 rounded-lg shrink-0 relative overflow-hidden">
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={`${currentTrack.title} cover`}
                  fill
                  sizes="38px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full" style={{ background: currentTrack.gradient }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-zinc-100 truncate">{currentTrack.title}</p>
              <p className="text-[10px] text-blue-400 font-mono tracking-wide mt-0.5 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              type="button"
              aria-label="Like song"
              className="text-blue-500 hover:text-blue-400 transition-colors shrink-0"
            >
              <Heart size={14} fill="currentColor" />
            </button>
          </div>

          {/* ── Controls + progress ── */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-3.5">
              <CtrlBtn onClick={toggleShuffle} active={isShuffle} ariaLabel="Shuffle">
                <Shuffle size={13} />
              </CtrlBtn>
              <CtrlBtn onClick={skipPrev} ariaLabel="Previous track">
                <SkipBack size={13} />
              </CtrlBtn>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <CtrlBtn onClick={skipNext} ariaLabel="Next track">
                <SkipForward size={13} />
              </CtrlBtn>
              <CtrlBtn onClick={toggleRepeat} active={isRepeat} ariaLabel="Repeat">
                <Repeat size={13} />
              </CtrlBtn>
            </div>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 font-mono w-8 text-right shrink-0">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-0.75 bg-white/8 rounded-full cursor-pointer relative group/prog"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-blue-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-zinc-950 opacity-0 group-hover/prog:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono w-8 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLyrics}
              aria-label="Toggle lyrics"
              className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-blue-500 hover:bg-white/5 transition-all"
            >
              <MessageSquare size={14} />
            </button>
            <div className="flex items-center gap-1.5">
              <Volume2 size={13} className="text-zinc-500" />
              <div
                className="w-14 h-0.75 bg-white/8 rounded-full cursor-pointer"
                onClick={handleVolumeClick}
              >
                <div className="h-full bg-white/25 rounded-full" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center font-['Bebas_Neue'] text-[9px] tracking-[4px] text-blue-900 mt-1 select-none">
          RUL09
        </p>
      </motion.div>
    </AnimatePresence>
  )
}

function CtrlBtn({
  children, onClick, active, ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  ariaLabel: string
}) {
  const toggleProps = active !== undefined ? { 'aria-pressed': active } : {}
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      {...toggleProps}
      className={cn(
        'w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer',
        active
          ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
          : 'border-white/[0.07] text-zinc-500 hover:text-zinc-300 hover:border-white/14'
      )}
    >
      {children}
    </button>
  )
}
