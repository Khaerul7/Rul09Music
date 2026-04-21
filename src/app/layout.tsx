import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { MusicPlayer }    from '@/components/MusicPlayer'
import { LyricsPanel }    from '@/components/LyricsPanel'
import { LyricsProvider } from '@/components/LyricsProvider'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const dmSans    = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const dmMono    = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--font-dm-mono' })

export const metadata: Metadata = {
  title: 'RUL09 Music',
  description: 'Modern music player with synchronized lyrics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} bg-zinc-950 text-zinc-100 antialiased`}>
        <LyricsProvider>
          {children}
          <MusicPlayer />
          <LyricsPanel />
        </LyricsProvider>
      </body>
    </html>
  )
}
