export type AdType = 'banner' | 'interstitial' | 'rewarded';
export type AdPlacement = 'home_banner' | 'chat_interstitial' | 'reward_extra_feature' | 'list_native';

export interface AdCondition {
  /** 구독자면 광고 안 보임 */
  requireFree: boolean;
  /** 통화 중이면 광고 안 보임 */
  blockDuringCall: boolean;
  /** 채팅방 내 광고 차단 */
  blockInChat: boolean;
  /** 최소 노출 간격 (초) */
  minInterval: number;
}

export interface AdConfig {
  placement: AdPlacement;
  type: AdType;
  condition: AdCondition;
}
