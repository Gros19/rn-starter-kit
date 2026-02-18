import { Platform } from 'react-native';

// expo-notifications는 런타임에 동적 임포트 (설치 후 사용)
let Notifications: typeof import('expo-notifications') | null = null;

async function loadNotifications() {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
    } catch {
      console.warn('expo-notifications not installed');
    }
  }
  return Notifications;
}

export async function registerForPushNotifications(): Promise<string | null> {
  const mod = await loadNotifications();
  if (!mod) return null;

  const { status: existingStatus } = await mod.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await mod.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const tokenData = await mod.getExpoPushTokenAsync();
  return tokenData.data;
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number = 5,
): Promise<string | null> {
  const mod = await loadNotifications();
  if (!mod) return null;

  const id = await mod.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { type: mod.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false },
  });
  return id;
}

export async function setupAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const mod = await loadNotifications();
  if (!mod) return;

  const channels = [
    { id: 'general', name: '일반', importance: mod.AndroidImportance.DEFAULT },
    { id: 'todo', name: '할 일 알림', importance: mod.AndroidImportance.HIGH },
    { id: 'upload', name: '업로드 완료', importance: mod.AndroidImportance.DEFAULT },
    { id: 'subscription', name: '구독 알림', importance: mod.AndroidImportance.DEFAULT },
    { id: 'system', name: '시스템', importance: mod.AndroidImportance.LOW },
  ];

  for (const ch of channels) {
    await mod.setNotificationChannelAsync(ch.id, {
      name: ch.name,
      importance: ch.importance,
    });
  }
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const mod = await loadNotifications();
  if (!mod) return 'undetermined';
  const { status } = await mod.getPermissionsAsync();
  return status as 'granted' | 'denied' | 'undetermined';
}

export type NotificationSubscription = { remove: () => void };

export async function addNotificationReceivedListener(
  callback: (notification: unknown) => void,
): Promise<NotificationSubscription | null> {
  const mod = await loadNotifications();
  if (!mod) return null;
  return mod.addNotificationReceivedListener(callback);
}

export async function addNotificationResponseListener(
  callback: (response: unknown) => void,
): Promise<NotificationSubscription | null> {
  const mod = await loadNotifications();
  if (!mod) return null;
  return mod.addNotificationResponseReceivedListener(callback);
}
