/**
 * 광고 조건부 활성화 엔진
 * 모든 광고는 이 엔진을 통해서만 표시 (하드코딩 금지)
 */
import type { AdCondition, AdPlacement } from '@/lib/types/ads';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';

/** 마지막 노출 시간 기록 */
const lastShownMap = new Map<AdPlacement, number>();

/** 활성 통화 여부 (call store에서 주입) */
let isInCall = false;
/** 채팅방 활성 여부 (chat에서 주입) */
let isInChatRoom = false;

export function setCallState(inCall: boolean) {
  isInCall = inCall;
}

export function setChatRoomState(inChat: boolean) {
  isInChatRoom = inChat;
}

/** 광고 표시 가능 여부 판단 */
export function canShowAd(placement: AdPlacement, condition: AdCondition): boolean {
  // 1. 구독자 = 광고 OFF
  if (condition.requireFree) {
    const isPremium = useSubscriptionStore.getState().isPremium();
    if (isPremium) return false;
  }

  // 2. 통화 중 = 광고 차단
  if (condition.blockDuringCall && isInCall) return false;

  // 3. 채팅방 내 = 광고 차단
  if (condition.blockInChat && isInChatRoom) return false;

  // 4. 최소 간격 체크
  if (condition.minInterval > 0) {
    const lastShown = lastShownMap.get(placement);
    if (lastShown && Date.now() - lastShown < condition.minInterval * 1000) {
      return false;
    }
  }

  return true;
}

/** 광고 노출 기록 */
export function recordAdImpression(placement: AdPlacement) {
  lastShownMap.set(placement, Date.now());
}

/** 기본 광고 조건 프리셋 */
export const AD_CONDITIONS: Record<AdPlacement, AdCondition> = {
  home_banner: {
    requireFree: true,
    blockDuringCall: true,
    blockInChat: false,
    minInterval: 0,
  },
  chat_interstitial: {
    requireFree: true,
    blockDuringCall: true,
    blockInChat: true,
    minInterval: 300, // 5분
  },
  reward_extra_feature: {
    requireFree: true,
    blockDuringCall: true,
    blockInChat: false,
    minInterval: 60,
  },
  list_native: {
    requireFree: true,
    blockDuringCall: true,
    blockInChat: true,
    minInterval: 0,
  },
};
