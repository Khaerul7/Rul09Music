import { NextRequest, NextResponse } from 'next/server'

const LRCLIB_BASE = 'https://lrclib.net/api'

interface LyricLine {
  time: number
  text: string
}

// Parse format .lrc → LyricLine[]
// Contoh input:  "[01:24.50] I said ooh"
// Contoh output: { time: 84.5, text: "I said ooh" }
function parseLrc(lrc: string): LyricLine[] {
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/
  return lrc
    .split('\n')
    .map((line) => {
      const m = line.match(regex)
      if (!m) return null
      const time =
        Number(m[1]) * 60 +
        Number(m[2]) +
        Number(m[3].padEnd(3, '0')) / 1000
      return { time, text: m[4].trim() }
    })
    .filter(Boolean)
    .sort((a, b) => a!.time - b!.time) as LyricLine[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const track    = searchParams.get('track')?.trim()
  const artist   = searchParams.get('artist')?.trim()
  const album    = searchParams.get('album')?.trim()
  const duration = searchParams.get('duration')

  if (!track || !artist) {
    return NextResponse.json(
      { error: 'Parameter "track" dan "artist" wajib diisi' },
      { status: 400 }
    )
  }

  try {
    const params = new URLSearchParams({
      track_name:  track,
      artist_name: artist,
      ...(album    && { album_name: album }),
      ...(duration && { duration }),
    })

    const res = await fetch(`${LRCLIB_BASE}/get?${params}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RUL09Music/1.0',
      },
      next: { revalidate: 3600 },
    })

    // Tidak ada di database LRCLIB
    if (res.status === 404) {
      return NextResponse.json({ lyrics: [], synced: false })
    }

    if (!res.ok) throw new Error(`LRCLIB: ${res.status}`)

    const data = await res.json()

    if (data.instrumental) {
      return NextResponse.json({ lyrics: [], synced: false, instrumental: true })
    }

    // Prioritas: syncedLyrics → plainLyrics
    if (data.syncedLyrics) {
      return NextResponse.json({ lyrics: parseLrc(data.syncedLyrics), synced: true })
    }

    if (data.plainLyrics) {
      const lyrics: LyricLine[] = data.plainLyrics
        .split('\n')
        .filter(Boolean)
        .map((text: string, i: number) => ({ time: i * 3, text }))
      return NextResponse.json({ lyrics, synced: false })
    }

    return NextResponse.json({ lyrics: [], synced: false })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/lyrics]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
