export type SubscriptionTier = 'free' | 'premium';
export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  productId: string; // IAP product ID
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  price: string;
  pricePerMonth: string;
  features: string[];
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  expiresAt: string | null;
  isActive: boolean;
  autoRenewing: boolean;
  productId: string | null;
}

/** 기능 게이팅 키 */
export type FeatureKey =
  | 'ad_free'
  | 'unlimited_storage'
  | 'unlimited_call_duration'
  | 'offline_download'
  | 'unlimited_todos'
  | 'advanced_chat';

/** 무료 플랜 제한 */
export const FREE_TIER_LIMITS: Record<string, number> = {
  maxTodos: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxCallDuration: 5 * 60, // 5분
};

export const PREMIUM_FEATURES: FeatureKey[] = [
  'ad_free',
  'unlimited_storage',
  'unlimited_call_duration',
  'offline_download',
  'unlimited_todos',
  'advanced_chat',
];
