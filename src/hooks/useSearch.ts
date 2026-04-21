'use client'

import { useState, useCallback, useRef } from 'react'
import type { Track } from '@/types/music'

interface UseSearchReturn {
  results: Track[]
  total: number
  isLoading: boolean
  error: string | null
  search: (query: string) => void
}

// Arahkan ke BE eksternal jika NEXT_PUBLIC_API_BASE di-set,
// fallback ke Next.js API route bawaan kalau tidak ada
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ''

export function useSearch(debounceMs = 400): UseSearchReturn {
  const [results, setResults]   = useState<Track[]>([])
  const [total, setTotal]       = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSearch = useCallback(async (query: string) => {
    // Batalkan request sebelumnya
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    if (!query.trim()) {
      setResults([])
      setTotal(0)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${API_BASE}/api/search?q=${encodeURIComponent(query)}&limit=20`,
        { signal: abortRef.current.signal }
      )

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json()
      setResults(data.tracks ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Search gagal')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce — tunggu user berhenti ketik 400ms baru fetch
  const search = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fetchSearch(query), debounceMs)
  }, [fetchSearch, debounceMs])

  return { results, total, isLoading, error, search }
}
