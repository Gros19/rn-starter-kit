import type { PropsWithChildren, ReactNode } from 'react';
import { useSubscriptionStore } from '@/features/subscription/store';
import type { FeatureKey } from '@/features/subscription/types';

interface FeatureGateProps extends PropsWithChildren {
  feature: FeatureKey;
  fallback: ReactNode;
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const canUse = useSubscriptionStore((s) => s.canUse);

  if (!canUse(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
