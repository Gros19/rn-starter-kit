import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/utils/storage';
import type { Plan, FeatureKey, FeatureLimit } from './types';

const FREE_LIMITS: Record<FeatureKey, FeatureLimit> = {
  unlimited_todos: { limit: 10, used: 0 },
  large_upload: { limit: 10 * 1024 * 1024, used: 0 }, // 10MB
  priority_support: { limit: 0, used: 0 },
};

const PREMIUM_LIMITS: Record<FeatureKey, FeatureLimit> = {
  unlimited_todos: { limit: Infinity, used: 0 },
  large_upload: { limit: 100 * 1024 * 1024, used: 0 }, // 100MB
  priority_support: { limit: 1, used: 0 },
};

interface SubscriptionState {
  plan: Plan;
  limits: Record<FeatureKey, FeatureLimit>;
  canUse: (feature: FeatureKey) => boolean;
  incrementUsage: (feature: FeatureKey, amount?: number) => void;
  upgrade: () => void;
  downgrade: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'free',
      limits: { ...FREE_LIMITS },

      canUse: (feature: FeatureKey) => {
        const { plan, limits } = get();
        if (plan === 'premium') return true;
        const limit = limits[feature];
        if (!limit) return false;
        return limit.used < limit.limit;
      },

      incrementUsage: (feature: FeatureKey, amount: number = 1) => {
        set((state) => ({
          limits: {
            ...state.limits,
            [feature]: {
              ...state.limits[feature],
              used: state.limits[feature].used + amount,
            },
          },
        }));
      },

      upgrade: () => {
        set((state) => ({
          plan: 'premium' as Plan,
          limits: Object.fromEntries(
            Object.entries(PREMIUM_LIMITS).map(([key, val]) => [
              key,
              { ...val, used: state.limits[key as FeatureKey]?.used ?? 0 },
            ]),
          ) as Record<FeatureKey, FeatureLimit>,
        }));
      },

      downgrade: () => {
        set((state) => ({
          plan: 'free' as Plan,
          limits: Object.fromEntries(
            Object.entries(FREE_LIMITS).map(([key, val]) => [
              key,
              { ...val, used: state.limits[key as FeatureKey]?.used ?? 0 },
            ]),
          ) as Record<FeatureKey, FeatureLimit>,
        }));
      },
    }),
    {
      name: 'subscription-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        plan: state.plan,
        limits: state.limits,
      }),
    },
  ),
);
