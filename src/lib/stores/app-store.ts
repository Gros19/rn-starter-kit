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
  /** zustand persist hydration 완료 여부 */
  _hasHydrated: boolean;

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
      _hasHydrated: false,

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
      onRehydrateStorage: () => {
        return () => {
          useAppStore.setState({ _hasHydrated: true });
        };
      },
    },
  ),
);

// zustand persist hydration 완료 보장
// onRehydrateStorage 콜백이 호출되지 않는 환경(Expo Go 등)을 위한 안전장치
useAppStore.persist.onFinishHydration(() => {
  useAppStore.setState({ _hasHydrated: true });
});

// hydration이 시작 후 일정 시간 내에 완료되지 않으면 강제 설정
setTimeout(() => {
  if (!useAppStore.getState()._hasHydrated) {
    useAppStore.setState({ _hasHydrated: true });
  }
}, 100);
