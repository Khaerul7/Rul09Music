import { Router } from 'express'
import { config }  from '../config/index.js'
import { createError } from '../middleware/errorHandler.js'

const router = Router()

/**
 * GET /api/track/:id
 *
 * Params:
 *   id  string  — ID track dari Deezer
 *
 * Response:
 *   Track lengkap dengan bpm dan year
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id || isNaN(Number(id))) {
      return next(createError(400, 'ID tidak valid, harus berupa angka'))
    }

    const deezerRes = await fetch(`${config.deezerBaseUrl}/track/${id}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (deezerRes.status === 404) {
      return next(createError(404, 'Track tidak ditemukan'))
    }

    if (!deezerRes.ok) {
      throw createError(deezerRes.status, `Deezer API error: ${deezerRes.status}`)
    }

    const t = await deezerRes.json()

    return res.json({
      id:       String(t.id),
      title:    t.title,
      artist:   t.artist.name,
      album:    t.album.title,
      duration: t.duration,
      preview:  t.preview,
      cover:    t.album.cover_big || t.album.cover_medium || '',
      bpm:      t.bpm      ?? null,
      year:     t.release_date ? new Date(t.release_date).getFullYear() : null,
      gradient: '',
    })
  } catch (err) {
    next(err)
  }
})

export default router
