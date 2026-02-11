import { type PropsWithChildren } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Lock } from 'lucide-react-native';
import type { FeatureKey } from '@/lib/types/subscription';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';

interface FeatureGateProps extends PropsWithChildren {
  feature: FeatureKey;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const hasFeature = useSubscriptionStore((s) => s.hasFeature);
  const router = useRouter();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Pressable
      onPress={() => router.push('/paywall' as Href)}
      className="items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700"
      accessibilityRole="button"
      accessibilityLabel="프리미엄 기능 잠금"
    >
      <Lock size={24} color="#A3A3A3" />
      <Text className="text-sm text-neutral-500 mt-2 text-center">
        프리미엄 구독이 필요합니다
      </Text>
      <Text className="text-xs text-primary-500 font-semibold mt-1">업그레이드</Text>
    </Pressable>
  );
}
