import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/utils/storage';

interface AppState {
  /** 온보딩 완료 여부 */
  hasCompletedOnboarding: boolean;
  /** 앱 초기화 완료 */
  isReady: boolean;
  /** 네트워크 연결 상태 */
  isOnline: boolean;

  setOnboardingComplete: () => void;
  setReady: (ready: boolean) => void;
  setOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isReady: false,
      isOnline: true,

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setReady: (ready) => set({ isReady: ready }),
      setOnline: (online) => set({ isOnline: online }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);
