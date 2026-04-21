import { NextRequest, NextResponse } from 'next/server'

const DEEZER_BASE = 'https://api.deezer.com'

interface DeezerTrack {
  id: number
  title: string
  duration: number
  preview: string
  artist: { name: string }
  album: { title: string; cover_big: string; cover_medium: string }
}

interface DeezerResponse {
  data: DeezerTrack[]
  total: number
  next?: string
  error?: { message: string }
}

export async function GET(req: NextRequest) {
  const q     = req.nextUrl.searchParams.get('q')?.trim()
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 20), 50)
  const index = Number(req.nextUrl.searchParams.get('index') ?? 0)

  if (!q) {
    return NextResponse.json({ error: 'Parameter "q" wajib diisi' }, { status: 400 })
  }

  try {
    const url = `${DEEZER_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Deezer: ${res.status}`)

    const data: DeezerResponse = await res.json()
    if (data.error) throw new Error(data.error.message)

    const tracks = data.data.map((t) => ({
      id:       String(t.id),
      title:    t.title,
      artist:   t.artist.name,
      album:    t.album.title,
      duration: t.duration,
      preview:  t.preview,
      cover:    t.album.cover_big || t.album.cover_medium || '',
      gradient: '',
    }))

    return NextResponse.json({ tracks, total: data.total, next: data.next ?? null })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/search]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
