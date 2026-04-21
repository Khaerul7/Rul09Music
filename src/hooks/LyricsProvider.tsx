'use client'

import { useLyrics } from '@/hooks/useLyrics'

export function LyricsProvider({ children }: { children: React.ReactNode }) {
  useLyrics()
  return <>{children}</>
}
