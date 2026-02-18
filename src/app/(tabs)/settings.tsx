import { View, Alert, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSubscriptionStore } from '@/features/subscription/store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LogOut, Moon, User, Info, Bell, Crown } from 'lucide-react-native';
import { TestIds } from '@/lib/utils/testIds';

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { plan, upgrade, downgrade } = useSubscriptionStore();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 mb-6">
          <Text variant="h3" className="text-left">설정</Text>
        </View>

        {/* Profile */}
        <Card className="mb-4">
          <CardContent className="pt-0">
            <View className="flex-row items-center gap-4">
              <View className="bg-primary/10 w-14 h-14 rounded-full items-center justify-center">
                <User size={24} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-lg">{user?.name ?? '사용자'}</Text>
                <Text variant="muted">{user?.email ?? ''}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="mb-4" testID={TestIds.settings.subscriptionCard}>
          <CardContent className="pt-0">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Crown size={20} className="text-muted-foreground" />
                <View>
                  <Text>구독 플랜</Text>
                  <Badge variant={plan === 'premium' ? 'default' : 'secondary'} className="mt-1">
                    <Text>{plan === 'premium' ? '프리미엄' : '무료'}</Text>
                  </Badge>
                </View>
              </View>
              <Switch
                checked={plan === 'premium'}
                onCheckedChange={(checked) => {
                  if (checked) upgrade();
                  else downgrade();
                }}
              />
            </View>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-4">
          <CardContent className="pt-0">
            <Button
              variant="ghost"
              className="w-full justify-start"
              testID={TestIds.settings.notificationLink}
              onPress={() => router.push('/(features)/notification/settings' as Href)}
            >
              <Bell size={20} className="text-muted-foreground" />
              <Text>알림 설정</Text>
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-4">
          <CardContent className="pt-0">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Moon size={20} className="text-muted-foreground" />
                <Text>다크 모드</Text>
              </View>
              <Switch
                testID={TestIds.settings.darkModeSwitch}
                checked={colorScheme === 'dark'}
                onCheckedChange={() => {
                  Alert.alert('안내', '다크 모드는 시스템 설정을 따릅니다.');
                }}
              />
            </View>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4">
          <CardContent className="pt-0">
            <View className="flex-row items-center gap-3">
              <Info size={20} className="text-muted-foreground" />
              <Text>앱 버전</Text>
              <Text variant="muted" className="ml-auto">1.0.0</Text>
            </View>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Logout */}
        <Button
          variant="destructive"
          onPress={handleLogout}
          className="w-full"
          testID={TestIds.settings.logoutButton}
        >
          <LogOut size={18} color="#fff" />
          <Text>로그아웃</Text>
        </Button>
      </ScrollView>
    </SafeArea>
  );
}
