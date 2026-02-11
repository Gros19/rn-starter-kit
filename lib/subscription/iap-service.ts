/**
 * IAP 서비스 - react-native-iap 래퍼
 * 네이티브 빌드 시 react-native-iap 패키지 설치 필요:
 * npm install react-native-iap
 */
import type { SubscriptionPlan, SubscriptionStatus } from '@/lib/types/subscription';
import { api } from '@/lib/api/client';

// IAP Product IDs - 스토어 설정과 일치해야 함
export const PRODUCT_IDS = {
  monthlyPremium: 'com.app.premium.monthly',
  yearlyPremium: 'com.app.premium.yearly',
};

/** 서버에서 구독 상태 확인 */
async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { data, error } = await api.get<SubscriptionStatus>('/subscription/status');
  if (error || !data) {
    return {
      tier: 'free',
      expiresAt: null,
      isActive: false,
      autoRenewing: false,
      productId: null,
    };
  }
  return data;
}

/** 구매 영수증을 서버로 전송하여 검증 */
async function verifyReceipt(receipt: string, productId: string): Promise<SubscriptionStatus> {
  const { data, error } = await api.post<SubscriptionStatus>('/subscription/verify', {
    receipt,
    productId,
  });
  if (error || !data) throw new Error(error ?? '영수증 검증 실패');
  return data;
}

/** 구매 복원 */
async function restorePurchases(): Promise<SubscriptionStatus> {
  const { data, error } = await api.post<SubscriptionStatus>('/subscription/restore');
  if (error || !data) throw new Error(error ?? '구매 복원 실패');
  return data;
}

/** 상품 정보 (서버 또는 IAP에서 가져옴) */
async function getPlans(): Promise<SubscriptionPlan[]> {
  const { data } = await api.get<SubscriptionPlan[]>('/subscription/plans');
  return data ?? [
    {
      id: 'monthly',
      productId: PRODUCT_IDS.monthlyPremium,
      tier: 'premium',
      period: 'monthly',
      price: '₩9,900',
      pricePerMonth: '₩9,900',
      features: ['광고 제거', '무제한 저장소', '무제한 통화', '오프라인 다운로드'],
    },
    {
      id: 'yearly',
      productId: PRODUCT_IDS.yearlyPremium,
      tier: 'premium',
      period: 'yearly',
      price: '₩79,900',
      pricePerMonth: '₩6,658',
      features: ['광고 제거', '무제한 저장소', '무제한 통화', '오프라인 다운로드', '33% 할인'],
    },
  ];
}

export const iapService = {
  getSubscriptionStatus,
  verifyReceipt,
  restorePurchases,
  getPlans,
};
