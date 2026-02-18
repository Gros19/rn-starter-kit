import { View, ScrollView, Alert } from 'react-native';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/features/notification/hooks/use-notifications';
import { Bell, BellOff, Send } from 'lucide-react-native';
import { TestIds } from '@/lib/utils/testIds';

export default function NotificationSettingsScreen() {
  const {
    permissionStatus,
    pushToken,
    isLoading,
    requestPermission,
    sendTestNotification,
  } = useNotifications();

  const isGranted = permissionStatus === 'granted';

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        testID={TestIds.notification.screen}
      >
        {/* Permission Status */}
        <Card className="mt-4">
          <CardContent className="pt-0">
            <View className="flex-row items-center gap-3">
              {isGranted ? (
                <Bell size={20} className="text-primary" />
              ) : (
                <BellOff size={20} className="text-muted-foreground" />
              )}
              <View className="flex-1">
                <Text className="font-medium">알림 권한</Text>
                <Text variant="muted">
                  {isGranted ? '알림이 활성화되어 있습니다' : '알림 권한을 허용해주세요'}
                </Text>
              </View>
              <Badge variant={isGranted ? 'default' : 'secondary'}>
                <Text>{isGranted ? '허용' : '비활성'}</Text>
              </Badge>
            </View>

            {!isGranted && (
              <Button
                onPress={requestPermission}
                disabled={isLoading}
                className="mt-3"
              >
                <Text>알림 권한 요청</Text>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Push Token */}
        {pushToken && (
          <Card className="mt-4">
            <CardContent className="pt-0">
              <Text className="font-medium mb-1">Push Token</Text>
              <Text variant="muted" className="text-xs" numberOfLines={2}>
                {pushToken}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Test Notification */}
        <Card className="mt-4">
          <CardContent className="pt-0">
            <Text className="font-medium mb-2">테스트</Text>
            <Button
              variant="outline"
              onPress={async () => {
                await sendTestNotification();
                Alert.alert('알림 전송', '3초 후 테스트 알림이 도착합니다');
              }}
              disabled={!isGranted}
            >
              <Send size={16} className="text-foreground" />
              <Text>테스트 알림 보내기</Text>
            </Button>
            {!isGranted && (
              <Text variant="muted" className="mt-2 text-xs">
                알림 권한을 먼저 허용해주세요
              </Text>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </SafeArea>
  );
}
