import React from 'react';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  audioSrc: string;
  coverArt: string;
  mainColor: string;
  genre: string;
  lyrics?: LyricLine[];
}

export type RepeatMode = 'off' | 'all' | 'one';