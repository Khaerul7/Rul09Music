import { Router } from 'express'
import { config }  from '../config/index.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

/**
 * Parse format .lrc → array LyricLine
 * Contoh input:  "[01:24.50] I said ooh"
 * Contoh output: { time: 84.5, text: "I said ooh" }
 */
function parseLrc(lrc) {
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
    .sort((a, b) => a.time - b.time)
}

/**
 * GET /api/lyrics
 *
 * Query params:
 *   track    string  (wajib)  — judul lagu
 *   artist   string  (wajib)  — nama artis
 *   album    string  (opsional)
 *   duration number  (opsional)
 *
 * Response:
 *   { lyrics: LyricLine[], synced: boolean, instrumental?: boolean }
 */
router.get('/', async (req, res, next) => {
  try {
    const track    = req.query.track?.trim()
    const artist   = req.query.artist?.trim()
    const album    = req.query.album?.trim()
    const duration = req.query.duration

    if (!track || !artist) {
      return next(createError(400, 'Parameter "track" dan "artist" wajib diisi'))
    }

    const params = new URLSearchParams({ track_name: track, artist_name: artist })
    if (album)    params.set('album_name', album)
    if (duration) params.set('duration', duration)

    const lrclibRes = await fetch(`${config.lrclibBaseUrl}/get?${params}`, {
      headers: {
        Accept:       'application/json',
        'User-Agent': config.appName,
      },
      signal: AbortSignal.timeout(8000),
    })

    // Lagu tidak ada di database LRCLIB
    if (lrclibRes.status === 404) {
      return res.json({ lyrics: [], synced: false })
    }

    if (!lrclibRes.ok) {
      throw createError(lrclibRes.status, `LRCLIB error: ${lrclibRes.status}`)
    }

    const data = await lrclibRes.json()

    if (data.instrumental) {
      return res.json({ lyrics: [], synced: false, instrumental: true })
    }

    // Prioritas: syncedLyrics (dengan timestamp) → plainLyrics (tanpa timestamp)
    if (data.syncedLyrics) {
      return res.json({ lyrics: parseLrc(data.syncedLyrics), synced: true })
    }

    if (data.plainLyrics) {
      const lyrics = data.plainLyrics
        .split('\n')
        .filter(Boolean)
        .map((text, i) => ({ time: i * 3, text }))
      return res.json({ lyrics, synced: false })
    }

    return res.json({ lyrics: [], synced: false })
  } catch (err) {
    next(err)
  }
})

export default router
