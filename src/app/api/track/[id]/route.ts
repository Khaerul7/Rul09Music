import { NextRequest, NextResponse } from 'next/server'

const DEEZER_BASE = 'https://api.deezer.com'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 })
  }

  try {
    const res = await fetch(`${DEEZER_BASE}/track/${id}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })

    if (res.status === 404) {
      return NextResponse.json({ error: 'Track tidak ditemukan' }, { status: 404 })
    }

    if (!res.ok) throw new Error(`Deezer: ${res.status}`)

    const t = await res.json()

    return NextResponse.json({
      id:       String(t.id),
      title:    t.title,
      artist:   t.artist.name,
      album:    t.album.title,
      duration: t.duration,
      preview:  t.preview,
      cover:    t.album.cover_big || t.album.cover_medium || '',
      bpm:      t.bpm ?? null,
      year:     t.release_date ? new Date(t.release_date).getFullYear() : null,
      gradient: '',
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/track]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
