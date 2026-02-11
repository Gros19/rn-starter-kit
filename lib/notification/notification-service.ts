/**
 * 알림 서비스
 * expo-notifications + @react-native-firebase/messaging 연동
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import type { NotificationChannel } from '@/lib/types/notification';

/** 포그라운드 알림 설정 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** 푸시 토큰 요청 */
async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  // Android 채널 설정
  if (Platform.OS === 'android') {
    await setupAndroidChannels();
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

/** Android 알림 채널 */
async function setupAndroidChannels() {
  const channels: { id: NotificationChannel; name: string; importance: Notifications.AndroidImportance }[] = [
    { id: 'message', name: '메시지', importance: Notifications.AndroidImportance.HIGH },
    { id: 'call', name: '통화', importance: Notifications.AndroidImportance.MAX },
    { id: 'subscription', name: '구독', importance: Notifications.AndroidImportance.DEFAULT },
    { id: 'reminder', name: '리마인더', importance: Notifications.AndroidImportance.HIGH },
    { id: 'system', name: '시스템', importance: Notifications.AndroidImportance.DEFAULT },
  ];

  for (const ch of channels) {
    await Notifications.setNotificationChannelAsync(ch.id, {
      name: ch.name,
      importance: ch.importance,
      vibrationPattern: ch.id === 'call' ? [0, 250, 250, 250] : [0, 250],
      sound: ch.id === 'call' ? 'ringtone.wav' : undefined,
    });
  }
}

/** 로컬 알림 예약 */
async function scheduleLocal(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
  channelId?: NotificationChannel,
) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, ...(channelId ? { categoryIdentifier: channelId } : {}) },
    trigger,
  });
}

/** 딥링크 처리 */
function setupDeepLinkHandler() {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const deepLink = response.notification.request.content.data?.deepLink as string | undefined;
    if (deepLink) {
      router.push(deepLink as Href);
    }
  });
  return subscription;
}

/** 뱃지 초기화 */
async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}

export const notificationService = {
  registerForPushNotifications,
  scheduleLocal,
  setupDeepLinkHandler,
  clearBadge,
};
