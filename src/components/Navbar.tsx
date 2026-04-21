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
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex items-center px-4 sm:px-7 py-3">

        {/* ── Logo ── */}
        <div className="flex items-baseline gap-0.5 select-none shrink-0">
          <span className="font-['Bebas_Neue'] text-[24px] sm:text-[28px] tracking-[4px] text-zinc-100 leading-none">
            RUL
          </span>
          <span className="font-['Bebas_Neue'] text-[24px] sm:text-[28px] tracking-[4px] text-blue-500 leading-none">
            09
          </span>
          <span className="font-mono text-[8px] tracking-[3px] text-blue-500/70 ml-1 self-center hidden sm:inline">
            MUSIC
          </span>
        </div>

        {/* ── Pill Nav — scroll horizontal di mobile ── */}
        <nav
          className="flex items-center bg-white/4 border border-white/[0.07] rounded-full p-1 gap-0 sm:gap-1 mx-3 sm:mx-5 overflow-x-auto flex-1 sm:flex-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTabChange(item)}
              aria-label={`Go to ${item}`}
              aria-current={activeTab === item ? 'page' : undefined}
              className={cn(
                'px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0',
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            aria-label="Search"
            className="w-8 h-8 rounded-[10px] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14] transition-all cursor-pointer"
          >
            <Search size={13} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-[10px] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14] transition-all cursor-pointer hidden sm:flex"
          >
            <Bell size={13} />
          </button>
          <div className="w-8 h-8 rounded-[10px] bg-blue-500/15 border border-blue-500/25 flex items-center justify-center font-mono text-[10px] font-medium text-blue-400 select-none">
            R9
          </div>
        </div>

      </div>
    </header>
  )
}
