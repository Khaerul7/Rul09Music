'use client'

import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  resultCount?: number
  isLoading?: boolean
}

export function SearchBar({ value, onChange, resultCount, isLoading }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2.5 bg-white/4 border border-white/8 hover:border-blue-500/30 focus-within:border-blue-500/40 rounded-xl px-4 py-2.5 transition-colors duration-200">
      {isLoading
        ? <Loader2 size={14} className="text-blue-500 shrink-0 animate-spin" />
        : <Search  size={14} className="text-blue-500 shrink-0" />
      }
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search songs, artists, albums..."
        className="flex-1 bg-transparent border-none outline-none text-[13px] text-zinc-200 placeholder:text-zinc-600"
      />
      {resultCount !== undefined && value && !isLoading && (
        <span className="text-[11px] text-blue-500 font-mono whitespace-nowrap shrink-0">
          {resultCount} results
        </span>
      )}
    </div>
  )
}
