import { Track, LyricLine } from './types';

export const LYRICS_DATA: { [key: number]: LyricLine[] } = {
  1: [
    { time: 5, text: '(Verse 1)' },
    { time: 8, text: 'Rainy days and coffee cups' },
    { time: 12, text: 'City nights and neon lights' },
    { time: 16, text: 'Just a chill beat on repeat' },
    { time: 20, text: 'Feeling cozy, feeling right' },
    { time: 24, text: '(Chorus)' },
    { time: 27, text: 'Oh, lofi dreams and mellow scenes' },
    { time: 31, text: 'Got my headphones, in my zone' },
    { time: 35, text: 'Just vibing out, no need to shout' },
    { time: 39, text: "In this moment, I'm at home" },
  ],
  2: [
    { time: 3, text: '(Instrumental)' },
    { time: 10, text: 'A gentle piano melody,' },
    { time: 15, text: 'Strings that swell and flow.' },
    { time: 20, text: 'A soundscape vast as the open sea,' },
    { time: 25, text: 'Where quiet feelings grow.' },
    { time: 30, text: 'No words are needed to convey,' },
    { time: 35, text: 'The peace that fills the air.' },
    { time: 40, text: 'Just close your eyes and drift away,' },
    { time: 45, text: 'Without a single care.' },
  ],
  3: [
    { time: 5, text: '(Verse 1)' },
    { time: 9, text: 'Lights flash, the synth begins to climb' },
    { time: 13, text: 'Losing all my sense of time' },
    { time: 17, text: 'The beat drops, and the world just fades' },
    { time: 21, text: 'Lost in these electronic everglades' },
    { time: 25, text: '(Chorus)' },
    { time: 28, text: 'Future bass, a vibrant sound' },
    { time: 32, text: 'Lifting me right off the ground' },
    { time: 36, text: 'With every chord, a new design' },
    { time: 40, text: 'This energy is truly mine' },
  ],
  4: [
    { time: 4, text: '(Instrumental)' },
    { time: 12, text: 'A sweeping score for a silver screen,' },
    { time: 18, text: "A hero's journey, a final scene." },
    { time: 24, text: 'The orchestra builds, a powerful tide,' },
    { time: 30, text: 'With epic drums and nowhere to hide.' },
    { time: 36, text: 'A story told in notes and keys,' },
    { time: 42, text: 'Carried forward on the breeze.' },
    { time: 48, text: 'A cinematic dream takes flight,' },
    { time: 54, text: 'And fills the darkness with brilliant light.' },
  ],
  5: [
    { time: 6, text: 'Grid lines on a digital sea' },
    { time: 10, text: 'Sunset hues for you and me' },
    { time: 14, text: 'Driving fast, a retro dream' },
    { time: 18, text: 'Living in a synthwave theme' },
    { time: 22, text: '(Chorus)' },
    { time: 25, text: 'Neon drive, through the night' },
    { time: 29, text: 'Underneath the purple light' },
    { time: 33, text: 'The engine hums a steady beat' },
    { time: 37, text: 'This 80s vibe can\'t be beat' },
  ]
};

// This defines the shape of a track without the lyrics property.
type TrackData = Omit<Track, 'lyrics'>;

// Replace this with your own music tracks
export const TRACKS: TrackData[] = [
  {
    id: 1,
    title: 'Lofi Chill',
    artist: 'SoundCanvas',
    audioSrc: 'https://cdn.pixabay.com/audio/2022/02/01/audio_eb721999d9.mp3',
    coverArt: 'https://images.unsplash.com/photo-1516962322815-5e4e83f32490?q=80&w=800&auto=format&fit=crop',
    mainColor: '#3b82f6', // blue
    genre: 'Lofi',
  },
  {
    id: 2,
    title: 'Ambient Classical',
    artist: 'SoundCanvas',
    audioSrc: 'https://cdn.pixabay.com/audio/2022/11/17/audio_859b8974a6.mp3',
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
    mainColor: '#db2777', // pink
    genre: 'Ambient',
  },
  {
    id: 3,
    title: 'Future Bass',
    artist: 'SoundCanvas',
    audioSrc: 'https://cdn.pixabay.com/audio/2021/07/22/audio_c29d6621f3.mp3',
    coverArt: 'https://images.unsplash.com/photo-1619983081563-436f63e02242?q=80&w=800&auto=format&fit=crop',
    mainColor: '#7c3aed', // purple
    genre: 'Electronic',
  },
  {
    id: 4,
    title: 'Cinematic Dream',
    artist: 'SoundCanvas',
    audioSrc: 'https://cdn.pixabay.com/audio/2024/05/10/audio_6dee399f66.mp3',
    coverArt: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop',
    mainColor: '#06b6d4', // cyan
    genre: 'Cinematic',
  },
  {
    id: 5,
    title: 'Neon Drive',
    artist: 'SoundCanvas',
    audioSrc: 'https://cdn.pixabay.com/audio/2022/06/09/audio_2bbe645012.mp3',
    coverArt: 'https://images.unsplash.com/photo-1554734867-bf3c00a49371?q=80&w=800&auto=format&fit=crop',
    mainColor: '#f472b6', // hot pink
    genre: 'Synthwave',
  },
];