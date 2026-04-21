import { Router } from 'express'
import { config }  from '../config/index.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

/**
 * GET /api/search
 *
 * Query params:
 *   q       string  (wajib) — kata kunci pencarian
 *   limit   number  (opsional, default 20, max 50)
 *   index   number  (opsional, default 0) — offset untuk pagination
 *
 * Response:
 *   { tracks: Track[], total: number, next: string | null }
 */
router.get('/', async (req, res, next) => {
  try {
    const q     = req.query.q?.trim()
    const limit = Math.min(Number(req.query.limit ?? 20), 50)
    const index = Number(req.query.index ?? 0)

    if (!q) {
      return next(createError(400, 'Parameter "q" wajib diisi'))
    }

    const url = `${config.deezerBaseUrl}/search?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`

    const deezerRes = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (!deezerRes.ok) {
      throw createError(deezerRes.status, `Deezer API error: ${deezerRes.status}`)
    }

    const data = await deezerRes.json()

    if (data.error) {
      throw createError(502, data.error.message || 'Deezer API error')
    }

    const tracks = (data.data || []).map((t) => ({
      id:       String(t.id),
      title:    t.title,
      artist:   t.artist.name,
      album:    t.album.title,
      duration: t.duration,
      preview:  t.preview,
      cover:    t.album.cover_big || t.album.cover_medium || '',
      gradient: '',
    }))

    return res.json({
      tracks,
      total: data.total  ?? 0,
      next:  data.next   ?? null,
    })
  } catch (err) {
    next(err)
  }
})

export default router
