/**
 * 크로스 도메인 연동 매니저
 *
 * 연동 매트릭스:
 * - 구독 활성화 → 광고 OFF, 파일 용량 무제한, 통화 시간 무제한, 오프라인 다운로드 허용
 * - 통화 시작 → 음악 정지, 광고 차단 / 통화 종료 → 음악 재개
 * - 채팅 → 통화 시작 가능, 채팅방 내 광고 차단
 * - 알림 → 메시지/통화/구독만료/슬립타이머 등 모든 도메인 트리거
 */
import { useCallStore } from '@/lib/stores/call-store';
import { usePlayerStore } from '@/lib/stores/player-store';
import { setCallState, setChatRoomState } from '@/lib/ads/ad-condition-engine';

let previousPlayerState: 'playing' | 'paused' | null = null;

/** 통화 시작 시 호출 */
export function onCallStarted() {
  // 1. 음악 정지
  const playerState = usePlayerStore.getState();
  if (playerState.playbackState === 'playing') {
    previousPlayerState = 'playing';
    playerState.stop();
  }

  // 2. 광고 차단
  setCallState(true);
}

/** 통화 종료 시 호출 */
export function onCallEnded() {
  // 1. 음악 재개
  if (previousPlayerState === 'playing') {
    usePlayerStore.getState().resume();
    previousPlayerState = null;
  }

  // 2. 광고 해제
  setCallState(false);
}

/** 채팅방 입장 시 호출 */
export function onChatRoomEntered() {
  setChatRoomState(true);
}

/** 채팅방 퇴장 시 호출 */
export function onChatRoomLeft() {
  setChatRoomState(false);
}

/** 채팅방에서 통화 시작 */
export function startCallFromChat(calleeId: string) {
  onCallStarted();
  return useCallStore.getState().startCall(calleeId, 'audio');
}
