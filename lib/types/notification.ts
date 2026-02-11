export type NotificationChannel =
  | 'message'
  | 'call'
  | 'subscription'
  | 'reminder'
  | 'system';

export interface NotificationPayload {
  title: string;
  body: string;
  channel: NotificationChannel;
  data?: Record<string, string>;
  /** 딥링크 경로 */
  deepLink?: string;
}
