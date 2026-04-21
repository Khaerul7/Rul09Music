import express  from 'express'
import cors     from 'cors'
import 'dotenv/config'

import { config }       from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import searchRouter     from './routes/search.js'
import lyricsRouter     from './routes/lyrics.js'
import trackRouter      from './routes/track.js'

const app = express()

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (misalnya: Postman, curl)
    if (!origin) return callback(null, true)
    if (config.allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`Origin tidak diizinkan oleh CORS: ${origin}`))
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json())

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/search', searchRouter)
app.use('/api/lyrics', lyricsRouter)
app.use('/api/track',  trackRouter)

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan' })
})

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║         BE-Musik Server Running          ║
  ╠══════════════════════════════════════════╣
  ║  URL   : http://localhost:${config.port}          ║
  ║                                          ║
  ║  Endpoints:                              ║
  ║  GET /api/search?q=&limit=&index=        ║
  ║  GET /api/lyrics?track=&artist=          ║
  ║  GET /api/track/:id                      ║
  ║  GET /health                             ║
  ╚══════════════════════════════════════════╝
  `)
})
