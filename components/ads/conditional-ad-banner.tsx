/**
 * 조건부 광고 배너
 * react-native-google-mobile-ads 설치 후 실제 AdMob 연동
 * npm install react-native-google-mobile-ads
 */
import { View, Text } from 'react-native';
import type { AdPlacement } from '@/lib/types/ads';
import { canShowAd, AD_CONDITIONS, recordAdImpression } from '@/lib/ads/ad-condition-engine';

interface ConditionalAdBannerProps {
  placement: AdPlacement;
}

export function ConditionalAdBanner({ placement }: ConditionalAdBannerProps) {
  const condition = AD_CONDITIONS[placement];
  const shouldShow = canShowAd(placement, condition);

  if (!shouldShow) return null;

  // 노출 기록
  recordAdImpression(placement);

  // TODO: react-native-google-mobile-ads의 BannerAd로 교체
  return (
    <View className="h-[50px] bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
      <Text className="text-xs text-neutral-400">Ad Placeholder ({placement})</Text>
    </View>
  );
}
