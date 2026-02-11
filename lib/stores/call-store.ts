import { create } from 'zustand';
import type { CallSession, CallState } from '@/lib/types/call';
import { api } from '@/lib/api/client';
import { setCallState } from '@/lib/ads/ad-condition-engine';
import { FREE_TIER_LIMITS } from '@/lib/types/subscription';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';

interface CallStoreState {
  session: CallSession | null;
  isMuted: boolean;
  isSpeakerOn: boolean;
  duration: number; // 초

  /** 통화 시작 요청 */
  startCall: (calleeId: string, type: CallSession['callType']) => Promise<void>;

  /** 수신 통화 수락 */
  acceptCall: (sessionId: string) => Promise<void>;

  /** 통화 종료 */
  endCall: () => Promise<void>;

  /** 통화 상태 업데이트 */
  updateState: (state: CallState) => void;

  /** 음소거 토글 */
  toggleMute: () => void;

  /** 스피커 토글 */
  toggleSpeaker: () => void;

  /** 타이머 틱 */
  tick: () => void;
}

export const useCallStore = create<CallStoreState>()((set, get) => ({
  session: null,
  isMuted: false,
  isSpeakerOn: false,
  duration: 0,

  startCall: async (calleeId, type) => {
    const { data, error } = await api.post<CallSession>('/call/start', { calleeId, type });
    if (error || !data) throw new Error(error ?? '통화 시작 실패');

    set({ session: data, duration: 0, isMuted: false, isSpeakerOn: false });
    setCallState(true); // 광고 엔진 + 플레이어 연동
  },

  acceptCall: async (sessionId) => {
    const { data, error } = await api.post<CallSession>(`/call/${sessionId}/accept`);
    if (error || !data) throw new Error(error ?? '통화 수락 실패');

    set({ session: data });
    setCallState(true);
  },

  endCall: async () => {
    const { session } = get();
    if (session) {
      await api.post(`/call/${session.id}/end`).catch(() => {});
    }
    set({ session: null, duration: 0 });
    setCallState(false); // 광고 엔진 해제, 플레이어 재개 가능
  },

  updateState: (state) => {
    set((s) => ({
      session: s.session ? { ...s.session, state } : null,
    }));
  },

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleSpeaker: () => set((s) => ({ isSpeakerOn: !s.isSpeakerOn })),

  tick: () => {
    const { duration } = get();
    const isPremium = useSubscriptionStore.getState().isPremium();
    const maxDuration = isPremium ? Infinity : FREE_TIER_LIMITS.maxCallDuration;

    if (duration >= maxDuration) {
      get().endCall();
      return;
    }

    set({ duration: duration + 1 });
  },
}));
