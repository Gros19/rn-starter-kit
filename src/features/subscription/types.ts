export type Plan = 'free' | 'premium';

export type FeatureKey = 'unlimited_todos' | 'large_upload' | 'priority_support';

export interface FeatureLimit {
  limit: number;
  used: number;
}
