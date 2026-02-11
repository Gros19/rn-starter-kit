export type CallState = 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended';
export type CallType = 'audio' | 'video';

export interface CallSession {
  id: string;
  roomName: string;
  callType: CallType;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  calleeId: string;
  state: CallState;
  startedAt?: string;
  endedAt?: string;
  livekitToken?: string;
}
