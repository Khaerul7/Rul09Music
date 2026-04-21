import type { Track } from '@/types/music'


/**
 * Fetch preview URL yang fresh dari BE untuk setiap track yang punya deezerId.
 * Dipanggil sekali saat app pertama load di page.tsx.
 *
 * - Kalau BE tidak bisa dicapai, track tetap ada tapi preview = '' (silent fail)
 * - Request dijalankan paralel dengan Promise.allSettled agar satu failure
 *   tidak membatalkan track lainnya
 */
export async function hydratePreviews(tracks: Track[]): Promise<Track[]> {
  const results = await Promise.allSettled(
    tracks.map(async (track) => {
      if (!track.deezerId) return track          // tidak ada ID → skip
      if (track.preview)   return track          // sudah ada preview → skip

      try {
        const res = await fetch(`/api/track/${track.deezerId}`)
        if (!res.ok) return track

        const data = await res.json()
        return { ...track, preview: data.preview ?? '' }
      } catch {
        return track   // network error → kembalikan track tanpa preview
      }
    })
  )

  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : tracks[i]
  )
}
