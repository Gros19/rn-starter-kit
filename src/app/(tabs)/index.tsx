import { ScrollView, View } from 'react-native';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth-store';
import { TestIds } from '@/lib/utils/testIds';
import { Code, Palette, Shield, Zap } from 'lucide-react-native';

const features = [
  {
    icon: Zap,
    title: 'Expo SDK 54',
    description: 'React Native 0.81, React 19, 최신 New Architecture 기반',
  },
  {
    icon: Palette,
    title: 'React Native Reusables',
    description: 'shadcn/ui 스타일 컴포넌트, NativeWind 다크모드 지원',
  },
  {
    icon: Shield,
    title: '인증 시스템',
    description: '이메일 로그인/회원가입, SecureStore 토큰 관리',
  },
  {
    icon: Code,
    title: 'TypeScript Strict',
    description: 'Zustand + React Query, 타입 안전한 API 클라이언트',
  },
];

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 mb-8" testID={TestIds.home.screen}>
          <View className="flex-row items-center gap-2 mb-1">
            <Text variant="h3" className="text-left" testID={TestIds.home.welcomeText}>
              안녕하세요{user?.name ? `, ${user.name}` : ''}
            </Text>
            <Badge variant="secondary">
              <Text>Starter Kit</Text>
            </Badge>
          </View>
          <Text variant="muted">프로덕션 레디 React Native 스타터킷</Text>
        </View>

        <View className="gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <View className="flex-row items-center gap-3">
                    <View className="bg-primary/10 p-2 rounded-lg">
                      <Icon size={20} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription className="mt-1">{feature.description}</CardDescription>
                    </View>
                  </View>
                </CardHeader>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
