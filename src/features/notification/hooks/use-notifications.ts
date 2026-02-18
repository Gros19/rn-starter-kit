import { useState, useCallback, useEffect, useRef } from 'react';
import {
  registerForPushNotifications,
  scheduleLocalNotification,
  getPermissionStatus,
  setupAndroidChannels,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  type NotificationSubscription,
} from '../service';

export function useNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState<unknown>(null);

  const receivedSub = useRef<NotificationSubscription | null>(null);
  const responseSub = useRef<NotificationSubscription | null>(null);

  useEffect(() => {
    getPermissionStatus().then(setPermissionStatus);

    // 알림 리스너 등록
    addNotificationReceivedListener((notification) => {
      setLastNotification(notification);
    }).then((sub) => {
      receivedSub.current = sub;
    });

    addNotificationResponseListener((response) => {
      // 딥링크 핸들링은 여기서 확장 가능
      console.log('Notification tapped:', response);
    }).then((sub) => {
      responseSub.current = sub;
    });

    return () => {
      receivedSub.current?.remove();
      responseSub.current?.remove();
    };
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setPushToken(token);
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }
      await setupAndroidChannels();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    await scheduleLocalNotification(
      '테스트 알림',
      '이것은 테스트 로컬 알림입니다.',
      3,
    );
  }, []);

  return {
    permissionStatus,
    pushToken,
    isLoading,
    lastNotification,
    requestPermission,
    sendTestNotification,
  };
}
