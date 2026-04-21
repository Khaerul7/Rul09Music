'use client'

import { Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = ['Discover', 'Trending', 'Library', 'Charts'] as const
type NavItem = (typeof NAV_ITEMS)[number]

interface NavbarProps {
  activeTab: NavItem
  onTabChange: (tab: NavItem) => void
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center px-7 py-3.5 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      {/* ── Logo ── */}
      <div className="flex items-baseline gap-0.5 mr-auto select-none">
        <span className="font-['Bebas_Neue'] text-[28px] tracking-[4px] text-zinc-100 leading-none">
          RUL
        </span>
        <span className="font-['Bebas_Neue'] text-[28px] tracking-[4px] text-blue-500 leading-none">
          09
        </span>
        <span className="font-mono text-[8px] tracking-[3px] text-blue-500/70 ml-1 self-center">
          MUSIC
        </span>
      </div>

      {/* ── Pill Nav ── */}
      <nav className="flex items-center bg-white/4 border border-white/[0.07] rounded-full p-1 gap-3 sm:gap-10 mr-5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onTabChange(item)}
            aria-label={`Go to ${item}`}
            aria-current={activeTab === item ? 'page' : undefined}
            className={cn(
              'px-4.5] py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap cursor-pointer',
              activeTab === item
                ? 'bg-blue-500 text-white font-medium'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/4'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search"
          className="w-8.5 h-8.5 rounded-[10px] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14] transition-all cursor-pointer"
        >
          <Search size={14} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="w-8.5 h-8.5rounded-[10px] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14] transition-all cursor-pointer"
        >
          <Bell size={14} />
        </button>
        <div className="w-8.5 h-8.5 rounded-[10px] bg-blue-500/15 border border-blue-500/25 flex items-center justify-center font-mono text-[10px] font-medium text-blue-400 select-none">
          R9
        </div>
      </div>
    </header>
  )
}
