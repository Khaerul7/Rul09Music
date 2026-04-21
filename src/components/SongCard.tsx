'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import type { Track } from '@/types/music'
import { usePlayerStore } from '@/store/usePlayerStore'
import { cn } from '@/lib/utils'

interface SongCardProps {
  track: Track
  index?: number
  onClick?: () => void  // ← prop baru untuk hasil search Deezer
}

export function SongCard({ track, index = 0, onClick }: SongCardProps) {
  const { currentTrack, isPlaying, setTrack, togglePlay } = usePlayerStore()
  const isActive = currentTrack?.id === track.id
  const isCurrentlyPlaying = isActive && isPlaying

  const handleClick = () => {
    if (onClick) return onClick()  // ← kalau dari search Deezer, pakai handler luar
    if (isActive) togglePlay()
    else setTrack(track)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={cn(
        'relative rounded-xl p-3 border cursor-pointer transition-colors duration-200 group',
        isActive
          ? 'bg-blue-500/8 border-blue-500/50'
          : 'bg-white/3 border-white/6 hover:bg-blue-500/5 hover:border-blue-500/35'
      )}
    >
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded"
        >
          {isCurrentlyPlaying ? '▶ NOW' : '⏸ PAUSED'}
        </motion.div>
      )}

      <div className="w-full aspect-square rounded-lg mb-2.5 relative overflow-hidden">
        {track.cover ? (
          <Image
            src={track.cover}
            alt={`${track.title} album cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
            priority={index < 4}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[26px]"
            style={{ background: track.gradient || 'linear-gradient(135deg,#1e1e2e,#3b82f6)' }}
          />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          {isCurrentlyPlaying
            ? <Pause size={22} className="text-white drop-shadow-lg" />
            : <Play  size={22} className="text-white drop-shadow-lg ml-0.5" />
          }
        </motion.div>
      </div>

      <p className="text-[12px] font-medium text-zinc-200 truncate">{track.title}</p>
      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{track.artist}</p>
    </motion.div>
  )
}
