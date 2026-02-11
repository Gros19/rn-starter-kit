export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped';
export type RepeatMode = 'off' | 'one' | 'all';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  url: string;
  duration: number; // 초
  isDownloaded?: boolean;
  localUri?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  playbackState: PlaybackState;
  position: number; // 초
  duration: number; // 초
  isShuffled: boolean;
  repeatMode: RepeatMode;
  volume: number; // 0-1
}
