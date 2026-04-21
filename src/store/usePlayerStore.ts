import { create } from 'zustand'
import type { Track, LyricLine, PlayerState, PlayerActions } from '@/types/music'

type PlayerStore = PlayerState & PlayerActions

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  volume: 0.7,
  isShuffle: false,
  isRepeat: false,
  lyrics: [],
  showLyrics: false,

  setTrack: (track: Track) => {
    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      lyrics: [], // kosongkan dulu, useLyrics akan fetch otomatis
    })
  },

  addToQueue: (track: Track) => {
    set((state) => ({ queue: [...state.queue, track] }))
  },

  setQueue: (tracks: Track[]) => {
    set({ queue: tracks })
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  play:  () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  setCurrentTime: (time: number) => {
    set({ currentTime: time })
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) })
  },

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeat:  () => set((state) => ({ isRepeat:  !state.isRepeat  })),

  skipNext: () => {
    const { queue, currentTrack, isShuffle } = get()
    if (!queue.length || !currentTrack) return
    const idx = queue.findIndex((t) => t.id === currentTrack.id)
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (idx + 1) % queue.length
    get().setTrack(queue[nextIdx])
  },

  skipPrev: () => {
    const { queue, currentTrack, currentTime } = get()
    if (currentTime > 3) { set({ currentTime: 0 }); return }
    if (!queue.length || !currentTrack) return
    const idx = queue.findIndex((t) => t.id === currentTrack.id)
    get().setTrack(queue[(idx - 1 + queue.length) % queue.length])
  },

  setLyrics: (lyrics: LyricLine[]) => set({ lyrics }),
  toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
  closeLyrics:  () => set({ showLyrics: false }),
}))

export const getActiveLyricIndex = (lyrics: LyricLine[], currentTime: number): number => {
  let active = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= currentTime) active = i
    else break
  }
  return active
}
