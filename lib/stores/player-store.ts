import { create } from 'zustand';
import type { PlaybackState, RepeatMode, Track } from '@/lib/types/player';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';

interface PlayerStoreState {
  currentTrack: Track | null;
  queue: Track[];
  playbackState: PlaybackState;
  position: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  volume: number;
  isMiniPlayerVisible: boolean;

  /** 트랙 재생 */
  play: (track: Track) => void;

  /** 일시정지 */
  pause: () => void;

  /** 재개 */
  resume: () => void;

  /** 정지 (통화 시 호출) */
  stop: () => void;

  /** 다음 트랙 */
  next: () => void;

  /** 이전 트랙 */
  previous: () => void;

  /** 큐에 추가 */
  addToQueue: (tracks: Track[]) => void;

  /** 셔플 토글 */
  toggleShuffle: () => void;

  /** 반복 모드 순환 */
  cycleRepeat: () => void;

  /** 위치 업데이트 */
  setPosition: (position: number) => void;

  /** 미니 플레이어 토글 */
  setMiniPlayerVisible: (visible: boolean) => void;

  /** 오프라인 다운로드 가능 여부 */
  canDownloadOffline: () => boolean;
}

export const usePlayerStore = create<PlayerStoreState>()((set, get) => ({
  currentTrack: null,
  queue: [],
  playbackState: 'idle',
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 'off',
  volume: 1,
  isMiniPlayerVisible: false,

  play: (track) => {
    // TODO: react-native-track-player와 연동
    set({
      currentTrack: track,
      playbackState: 'playing',
      position: 0,
      duration: track.duration,
      isMiniPlayerVisible: true,
    });
  },

  pause: () => set({ playbackState: 'paused' }),
  resume: () => set({ playbackState: 'playing' }),

  stop: () => {
    // 통화 시작 시 호출됨
    set({ playbackState: 'stopped' });
  },

  next: () => {
    const { queue, currentTrack, isShuffled, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      set({ currentTrack: queue[randomIndex], position: 0, playbackState: 'playing' });
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        set({ currentTrack: queue[0], position: 0, playbackState: 'playing' });
      } else {
        set({ playbackState: 'stopped' });
      }
    } else {
      set({ currentTrack: queue[nextIndex], position: 0, playbackState: 'playing' });
    }
  },

  previous: () => {
    const { queue, currentTrack, position } = get();
    if (!currentTrack) return;

    // 3초 이상 재생했으면 처음부터
    if (position > 3) {
      set({ position: 0 });
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      set({ currentTrack: queue[prevIndex], position: 0, playbackState: 'playing' });
    }
  },

  addToQueue: (tracks) => {
    set((s) => ({ queue: [...s.queue, ...tracks] }));
  },

  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),

  cycleRepeat: () => {
    const modes: RepeatMode[] = ['off', 'one', 'all'];
    const current = get().repeatMode;
    const nextIndex = (modes.indexOf(current) + 1) % modes.length;
    set({ repeatMode: modes[nextIndex] });
  },

  setPosition: (position) => set({ position }),

  setMiniPlayerVisible: (visible) => set({ isMiniPlayerVisible: visible }),

  canDownloadOffline: () => {
    return useSubscriptionStore.getState().hasFeature('offline_download');
  },
}));
