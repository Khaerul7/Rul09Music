export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number   // in seconds
  preview: string    // 30s audio URL — diisi runtime dari Deezer, BUKAN hardcode
  cover: any
  gradient: string   // CSS gradient for art placeholder
  deezerId?: string  // ID asli di Deezer, untuk fetch preview URL yang fresh
  bpm?: number
  year?: number
}

export interface LyricLine {
  time: number // in seconds
  text: string
}

export interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  currentTime: number
  volume: number
  isShuffle: boolean
  isRepeat: boolean
  lyrics: LyricLine[]
  showLyrics: boolean
}

export interface PlayerActions {
  setTrack: (track: Track) => void
  addToQueue: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  togglePlay: () => void
  play: () => void
  pause: () => void
  setCurrentTime: (time: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  skipNext: () => void
  skipPrev: () => void
  setLyrics: (lyrics: LyricLine[]) => void
  toggleLyrics: () => void
  closeLyrics: () => void
}

export type SearchFilter = 'all' | 'songs' | 'artists' | 'albums' | 'playlists'
