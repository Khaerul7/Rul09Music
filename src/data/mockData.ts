import type { Track, LyricLine } from '@/types/music'
import wedonttalkanymore from '@/assets/covers/wedonttalk.png'
import loveyourself from '@/assets/covers/LoveYourself.png'
import unforgettable from '@/assets/covers/unforgettable.jpg'
import workfromhome from '@/assets/covers/workFromHome.jpg'
import onmyway from '@/assets/covers/onmyway.jpg'
import attention from '@/assets/covers/attention.jpg'
import oceaneyes from '@/assets/covers/oceaneyes.jpg'
import birdoffather from '@/assets/covers/birdoffather.jpg'
import luther from '@/assets/covers/luther.jpg'
import heydaddy from '@/assets/covers/heydaddy.jpg'

// ⚠️  PENTING: field `preview` sengaja dikosongkan ("")
// Preview URL Deezer bersifat dinamis dan akan EXPIRE jika di-hardcode.
// URL yang benar di-fetch saat runtime via BE → /api/track/:deezerId
// Lihat: src/app/page.tsx → fungsi hydratePreviews()

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    deezerId: '117797212',
    title: 'we dont talk anymore',
    artist: 'charlie puth',
    album: 'Nine Track Mind',
    duration: 217,
    preview: '',
    cover: wedonttalkanymore,
    gradient: 'linear-gradient(135deg, #1e0533, #7c3aed)',
    bpm: 171,
    year: 2016,
  },
  {
    id: '2',
    deezerId: '112662368',
    title: 'Love yourself',
    artist: 'Justin Bieber',
    album: 'Purpose',
    duration: 234,
    preview: '',
    cover: loveyourself,
    gradient: 'linear-gradient(135deg, #0f2044, #2563eb)',
    bpm: 186,
    year: 2015,
  },
  {
    id: '3',
    deezerId: '382428781',
    title: 'Unforgettable',
    artist: 'French Montana',
    album: 'Jungle Rules',
    duration: 233,
    preview: '',
    cover: unforgettable,
    gradient: 'linear-gradient(135deg, #1a0a00, #c2410c)',
    bpm: 98,
    year: 2017,
  },
  {
    id: '4',
    deezerId: '125513414',
    title: 'Work from home',
    artist: 'Fifth Harmony',
    album: '7/27',
    duration: 217,
    preview: '',
    cover: workfromhome,
    gradient: 'linear-gradient(135deg, #0a1f00, #16a34a)',
    bpm: 95,
    year: 2016,
  },
  {
    id: '5',
    deezerId: '645583792',
    title: 'On my way',
    artist: 'Alan Walker, Sabrina Carpenter, & Farruko',
    album: 'On My Way',
    duration: 193,
    preview: '',
    cover: onmyway,
    gradient: 'linear-gradient(135deg, #1e1e00, #ca8a04)',
    bpm: 79,
    year: 2019,
  },
  {
    id: '6',
    deezerId: '349385251',
    title: 'Attention',
    artist: 'Charlie Puth',
    album: 'Voicenotes',
    duration: 211,
    preview: '',
    cover: attention,
    gradient: 'linear-gradient(135deg, #200020, #d946ef)',
    bpm: 83,
    year: 2017,
  },
]

export const TRENDING_TRACKS: Track[] = [
  {
    id: 't1',
    deezerId: '136337268',
    title: 'ocean eyes',
    artist: 'Billie Eilish',
    album: "don't smile at me",
    duration: 200,
    preview: '',
    cover: oceaneyes,
    gradient: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
    year: 2016,
  },
  {
    id: 't2',
    deezerId: '15597223',
    title: 'Hey daddy',
    artist: 'Usher',
    album: 'Raymond v Raymond',
    duration: 224,
    preview: '',
    cover: heydaddy,
    gradient: 'linear-gradient(135deg, #4a0072, #a855f7)',
    year: 2010,
  },
  {
    id: 't3',
    deezerId: '3106586641',
    title: 'luther',
    artist: 'Kendrick Lamar',
    album: 'GNX',
    duration: 178,
    preview: '',
    cover: luther,
    gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
    year: 2024,
  },
  {
    id: 't4',
    deezerId: '2801558052',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 210,
    preview: '',
    cover: birdoffather,
    gradient: 'linear-gradient(135deg, #0c2340, #0ea5e9)',
    year: 2024,
  },
]

export const MOCK_LYRICS: LyricLine[] = [
  { time: 0, text: '' },
  { time: 3.5, text: "I've been trying to call" },
  { time: 6.2, text: "I've been on my own for long enough" },
  { time: 10.1, text: "Maybe you can show me how to love, maybe" },
  { time: 15.4, text: "I'm going through withdrawals" },
  { time: 18.7, text: "You don't even have to do too much" },
  { time: 22.3, text: "You can turn me on with just a touch, baby" },
  { time: 28.0, text: "I look around and Sin City's cold and empty" },
  { time: 32.4, text: "No one's around to judge me" },
  { time: 35.8, text: "I can't see clearly when you're gone" },
  { time: 42.1, text: "I said, ooh, I'm blinded by the lights" },
  { time: 47.5, text: "No, I can't sleep until I feel your touch" },
  { time: 52.3, text: "I said, ooh, I'm drowning in the night" },
  { time: 57.8, text: "Oh, when I'm like this, you're the one I trust" },
  { time: 68.0, text: "Hey, hey, hey" },
  { time: 72.4, text: "I'm running out of time" },
  { time: 75.9, text: "'Cause I can see the sun light up the sky" },
  { time: 80.2, text: "Hey, hey, hey" },
  { time: 84.6, text: "So I hit the road in overdrive, baby, oh" },
]

export const TRACK_EMOJIS: Record<string, string> = {
  '1': '🌙', '2': '⭐', '3': '🔥', '4': '🌲', '5': '✨', '6': '💜',
  't1': '☕', 't2': '🪐', 't3': '🎤', 't4': '🐦', 't5': '🌙', 't6': '🌸',
}
