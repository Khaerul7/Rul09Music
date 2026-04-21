'use client'

import { useEffect } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'

// Arahkan ke BE eksternal jika NEXT_PUBLIC_API_BASE di-set,
// fallback ke Next.js API route bawaan kalau tidak ada
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ''

export function useLyrics() {
  const { currentTrack, setLyrics } = usePlayerStore()

  useEffect(() => {
    if (!currentTrack) return
    let cancelled = false

    const fetchLyrics = async () => {
      try {
        const params = new URLSearchParams({
          track:    currentTrack.title,
          artist:   currentTrack.artist,
          album:    currentTrack.album,
          duration: String(currentTrack.duration),
        })

        const res = await fetch(`${API_BASE}/api/lyrics?${params}`)
        if (!res.ok) return

        const data = await res.json()
        if (!cancelled && Array.isArray(data.lyrics) && data.lyrics.length > 0) {
          setLyrics(data.lyrics)
        }
      } catch {
        // lirik opsional
      }
    }

    fetchLyrics()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id])
}
