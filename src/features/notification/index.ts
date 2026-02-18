export type { NotificationChannel, NotificationSettings } from './types';
export { useNotifications } from './hooks/use-notifications';
export {
  registerForPushNotifications,
  scheduleLocalNotification,
  setupAndroidChannels,
  getPermissionStatus,
} from './service';
