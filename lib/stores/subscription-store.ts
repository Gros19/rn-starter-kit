import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  FeatureKey,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionTier,
} from '@/lib/types/subscription';
import { PREMIUM_FEATURES } from '@/lib/types/subscription';
import { iapService } from '@/lib/subscription/iap-service';
import { mmkvStorage } from '@/lib/utils/storage';

interface SubscriptionState {
  status: SubscriptionStatus;
  plans: SubscriptionPlan[];
  isLoading: boolean;

  /** 구독 상태 초기화 */
  initialize: () => Promise<void>;

  /** 상품 목록 로드 */
  loadPlans: () => Promise<void>;

  /** 구매 처리 (영수증 서버 검증) */
  purchase: (productId: string, receipt: string) => Promise<void>;

  /** 구매 복원 (App Store 정책 필수) */
  restore: () => Promise<void>;

  /** 기능 사용 가능 여부 */
  hasFeature: (feature: FeatureKey) => boolean;

  /** 현재 티어 */
  tier: () => SubscriptionTier;

  /** 프리미엄 여부 */
  isPremium: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      status: {
        tier: 'free',
        expiresAt: null,
        isActive: false,
        autoRenewing: false,
        productId: null,
      },
      plans: [],
      isLoading: false,

      initialize: async () => {
        try {
          const status = await iapService.getSubscriptionStatus();
          set({ status });
        } catch {
          // 오프라인이면 캐시된 상태 유지
        }
      },

      loadPlans: async () => {
        set({ isLoading: true });
        try {
          const plans = await iapService.getPlans();
          set({ plans });
        } finally {
          set({ isLoading: false });
        }
      },

      purchase: async (productId, receipt) => {
        set({ isLoading: true });
        try {
          const status = await iapService.verifyReceipt(receipt, productId);
          set({ status });
        } finally {
          set({ isLoading: false });
        }
      },

      restore: async () => {
        set({ isLoading: true });
        try {
          const status = await iapService.restorePurchases();
          set({ status });
        } finally {
          set({ isLoading: false });
        }
      },

      hasFeature: (feature: FeatureKey) => {
        const { status } = get();
        if (status.tier === 'premium' && status.isActive) {
          return PREMIUM_FEATURES.includes(feature);
        }
        return false;
      },

      tier: () => get().status.tier,

      isPremium: () => {
        const { status } = get();
        return status.tier === 'premium' && status.isActive;
      },
    }),
    {
      name: 'subscription-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ status: state.status }),
    },
  ),
);
