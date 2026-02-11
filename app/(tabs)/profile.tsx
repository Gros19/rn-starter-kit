import { View, Text, Alert, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Crown, LogOut, Trash2, Bell, Settings } from 'lucide-react-native';
import { SafeArea } from '@/components/layout';
import { Avatar } from '@/components/ui';
import { ListItem } from '@/components/composite';
import { Divider } from '@/components/ui';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';

export default function ProfileScreen() {
  const { user, signOut, deleteAccount, isLoading } = useAuthStore();
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', onPress: signOut },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 정말 탈퇴하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: deleteAccount,
        },
      ],
    );
  };

  return (
    <SafeArea edges={['top']}>
      <ScrollView>
        <View className="items-center pt-8 pb-6">
          <Avatar uri={user?.avatar} name={user?.name} size="xl" />
          <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-4">
            {user?.name ?? '사용자'}
          </Text>
          <Text className="text-sm text-neutral-500 mt-0.5">{user?.email}</Text>
          {isPremium() && (
            <View className="flex-row items-center bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full mt-2">
              <Crown size={14} color="#0a7ea4" />
              <Text className="text-xs text-primary-700 dark:text-primary-300 font-medium ml-1">
                Premium
              </Text>
            </View>
          )}
        </View>

        <Divider />

        <ListItem
          title="구독 관리"
          leftIcon={<Crown size={20} color="#0a7ea4" />}
          showChevron
          onPress={() => router.push('/paywall' as Href)}
        />
        <ListItem
          title="알림 설정"
          leftIcon={<Bell size={20} color="#737373" />}
          showChevron
          onPress={() => {}}
        />
        <ListItem
          title="설정"
          leftIcon={<Settings size={20} color="#737373" />}
          showChevron
          onPress={() => {}}
        />

        <Divider className="my-2" />

        <ListItem
          title="로그아웃"
          leftIcon={<LogOut size={20} color="#737373" />}
          onPress={handleSignOut}
        />
        <ListItem
          title="회원 탈퇴"
          leftIcon={<Trash2 size={20} color="#EF4444" />}
          destructive
          onPress={handleDeleteAccount}
        />
      </ScrollView>
    </SafeArea>
  );
}
