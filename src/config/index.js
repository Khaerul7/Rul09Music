import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT) || 3001,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  deezerBaseUrl: process.env.DEEZER_BASE_URL || 'https://api.deezer.com',
  lrclibBaseUrl: process.env.LRCLIB_BASE_URL  || 'https://lrclib.net/api',
  appName:       process.env.APP_NAME          || 'MusikApp/1.0',
}
