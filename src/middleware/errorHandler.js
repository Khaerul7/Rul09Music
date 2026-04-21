/**
 * Global error handler Express
 * Tangkap semua error yang di-next() dari route handler
 */
export function errorHandler(err, req, res, _next) {
  const status  = err.status  || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${status}: ${message}`)

  res.status(status).json({ error: message })
}

/**
 * Helper: buat error dengan HTTP status code
 */
export function createError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}
