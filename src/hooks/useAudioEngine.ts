'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'

// ── Singleton ─────────────────────────────────────────────────────────────────
let _audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio()
    _audio.preload = 'metadata'
    // JANGAN pakai crossOrigin = 'anonymous' — Deezer CDN tidak support
  }
  return _audio
}

export function useAudioEngine() {
  const rafRef     = useRef<number>(0)
  const loadedRef  = useRef<string>('') // track id yang sudah di-load

  const {
    currentTrack,
    isPlaying,
    volume,
    isRepeat,
    skipNext,
    setCurrentTime,
    pause,
  } = usePlayerStore()

  // ── Load track baru + langsung play ─────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!currentTrack?.preview) return
    if (loadedRef.current === currentTrack.id) return // sudah di-load, skip

    const audio = getAudio()
    loadedRef.current = currentTrack.id

    audio.pause()
    audio.src = currentTrack.preview
    audio.currentTime = 0

    // Tunggu canplay sebelum play — hindari race condition
    const onCanPlay = () => {
      audio.play().catch(() => pause())
      audio.removeEventListener('canplay', onCanPlay)
    }
    audio.addEventListener('canplay', onCanPlay)
    audio.load()

    return () => audio.removeEventListener('canplay', onCanPlay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id])

  // ── Play / Pause (hanya kalau track sudah loaded) ────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = getAudio()
    if (!audio.src) return // belum ada track, skip

    if (isPlaying) {
      audio.play().catch(() => pause())
    } else {
      audio.pause()
    }
  }, [isPlaying, pause])

  // ── Volume ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    getAudio().volume = Math.max(0, Math.min(1, volume))
  }, [volume])

  // ── RAF loop: sync currentTime → store ──────────────────────────────────
  const tick = useCallback(() => {
    const audio = getAudio()
    if (!audio.paused) setCurrentTime(audio.currentTime)
    rafRef.current = requestAnimationFrame(tick)
  }, [setCurrentTime])

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, tick])

  // ── Track ended ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = getAudio()
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else {
        skipNext()
      }
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [isRepeat, skipNext])

  // ── Seek ─────────────────────────────────────────────────────────────────
  const seek = useCallback((time: number) => {
    getAudio().currentTime = time
    setCurrentTime(time)
  }, [setCurrentTime])

  return { seek }
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
