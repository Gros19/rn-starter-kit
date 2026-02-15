import { View, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LogOut, Moon, User, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const colorScheme = useColorScheme();

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

        {/* Appearance */}
        <Card className="mb-4">
          <CardContent className="pt-0">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Moon size={20} className="text-muted-foreground" />
                <Text>다크 모드</Text>
              </View>
              <Switch
                checked={colorScheme === 'dark'}
                onCheckedChange={() => {
                  // 시스템 설정을 따르므로 표시만
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
        <Button variant="destructive" onPress={handleLogout} className="w-full">
          <LogOut size={18} color="#fff" />
          <Text>로그아웃</Text>
        </Button>
      </ScrollView>
    </SafeArea>
  );
}
