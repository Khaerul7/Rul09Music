'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { SearchBar } from '@/components/SearchBar'
import { SongCard } from '@/components/SongCard'
import { usePlayerStore } from '@/store/usePlayerStore'
import { useSearch } from '@/hooks/useSearch'
import { MOCK_TRACKS, TRENDING_TRACKS } from '@/data/mockData'
import { hydratePreviews } from '@/lib/hydratePreviews'
import type { Track, SearchFilter } from '@/types/music'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: SearchFilter }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Songs',     value: 'songs' },
  { label: 'Artists',   value: 'artists' },
  { label: 'Albums',    value: 'albums' },
  { label: 'Playlists', value: 'playlists' },
]

export default function DiscoverPage() {
  const [query, setQuery]               = useState('')
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all')
  const [activeTab, setActiveTab]       = useState<'Discover' | 'Trending' | 'Library' | 'Charts'>('Discover')

  // State untuk menyimpan tracks setelah preview URL diisi dari BE
  const [mockTracks,     setMockTracks]     = useState<Track[]>(MOCK_TRACKS)
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(TRENDING_TRACKS)

  const { setTrack, setQueue } = usePlayerStore()
  const { results, total, isLoading, error, search } = useSearch()

  // ── Hydrate preview URLs sekali saat pertama load ──────────────────────────
  // Preview URL Deezer expire jika di-hardcode.
  // Fungsi ini memanggil BE (/api/track/:deezerId) untuk tiap track
  // dan mengisi field `preview` dengan URL yang fresh.
  useEffect(() => {
    async function loadPreviews() {
      const [hydratedMock, hydratedTrending] = await Promise.all([
        hydratePreviews(MOCK_TRACKS),
        hydratePreviews(TRENDING_TRACKS),
      ])
      setMockTracks(hydratedMock)
      setTrendingTracks(hydratedTrending)
    }
    loadPreviews()
  }, [])

  // Trigger search hanya kalau ada query
  useEffect(() => {
    if (query.trim()) search(query)
  }, [query, search])

  const handleTrendingClick = (track: Track) => {
    setTrack(track)
    setQueue(trendingTracks)
  }

  const handleResultClick = (track: Track) => {
    setTrack(track)
    setQueue(results)
  }

  const handleMockClick = (track: Track) => {
    setTrack(track)
    setQueue(mockTracks)
  }

  const isSearching = query.trim().length > 0

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="px-7 pt-5 pb-36">

        {/* Search bar */}
        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={isSearching ? total : undefined}
            isLoading={isLoading}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveFilter(f.value)}
                aria-label={`Filter by ${f.label}`}
                {...(isActive ? { 'aria-pressed': true } : { 'aria-pressed': false })}
                className={cn(
                  'px-3.5 py-1 rounded-full text-[11px] border whitespace-nowrap transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'bg-blue-500/12 border-blue-500/30 text-blue-400'
                    : 'border-white/8 text-zinc-500 hover:text-zinc-300'
                )}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* ── Kalau ada query → tampil hasil search Deezer ── */}
        {isSearching ? (
          <>
            <SectionTitle>
              {isLoading ? 'Searching...' : `Results for "${query}"`}
            </SectionTitle>

            {isLoading && (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="text-blue-500 animate-spin" />
              </div>
            )}

            {error && !isLoading && (
              <p className="text-sm text-red-400 py-8 text-center">Gagal: {error}</p>
            )}

            {!isLoading && !error && results.length === 0 && (
              <div className="flex flex-col items-center py-16 text-zinc-600">
                <span className="text-4xl mb-3">🎵</span>
                <p className="text-sm">Tidak ada hasil untuk "{query}"</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 mb-8">
                {results.map((track, i) => (
                  <SongCard
                    key={track.id}
                    track={track}
                    index={i}
                    onClick={() => handleResultClick(track)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ── Kalau tidak ada query → tampil mockTracks + Trending ── */}
            <SectionTitle>Top Results</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 mb-8">
              {mockTracks.map((track, i) => (
                <SongCard
                  key={track.id}
                  track={track}
                  index={i}
                  onClick={() => handleMockClick(track)}
                />
              ))}
            </div>

            <SectionTitle>Trending Now</SectionTitle>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {trendingTracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTrendingClick(track)}
                  className="shrink-0 w-27 bg-white/2 border border-white/5 rounded-xl p-2.5 cursor-pointer hover:border-white/10 transition-colors"
                >
                  <div className="w-full aspect-square rounded-lg mb-2 relative overflow-hidden">
                    {track.cover ? (
                      <Image src={track.cover} alt={track.title} fill sizes="108px" className="object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full rounded-lg" style={{ background: track.gradient }} />
                    )}
                  </div>
                  <p className="text-[10px] font-medium text-zinc-400 truncate">{track.title}</p>
                  <p className="text-[9px] text-zinc-600 truncate mt-0.5">{track.artist}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-zinc-600 tracking-[2px] uppercase font-medium mb-3">
      {children}
    </p>
  )
}
