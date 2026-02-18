import { ScrollView, View, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSubscriptionStore } from '@/features/subscription/store';
import { TestIds } from '@/lib/utils/testIds';
import {
  CheckSquare,
  Upload,
  Bell,
  Crown,
  ChevronRight,
  FileText,
  MessageCircle,
  ImageIcon,
  Newspaper,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  testID?: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: CheckSquare,
    title: 'Todo',
    description: 'CRUD, 필터/검색, 낙관적 업데이트 패턴',
    href: '/(features)/todo',
    badge: 'P0',
    testID: TestIds.home.todoCard,
  },
  {
    icon: Upload,
    title: '파일 업로드',
    description: '카메라/갤러리/문서 선택 + 업로드 큐',
    href: '/(features)/upload',
    badge: 'P1',
    testID: TestIds.home.uploadCard,
  },
  {
    icon: Bell,
    title: '알림',
    description: '로컬 알림, 푸시 토큰, 권한 관리',
    href: '/(features)/notification/settings',
    badge: 'P1',
    testID: TestIds.home.notificationCard,
  },
  {
    icon: FileText,
    title: '게시판',
    description: 'CRUD + 댓글 + Zod 검증 + 카테고리 필터',
    href: '/(features)/board',
    testID: TestIds.home.boardCard,
  },
  {
    icon: MessageCircle,
    title: '채팅',
    description: '메시지 버블, Echo Bot, 타이핑 애니메이션',
    href: '/(features)/chat',
    testID: TestIds.home.chatCard,
  },
  {
    icon: ImageIcon,
    title: '갤러리',
    description: '이미지 그리드 + 풀스크린 뷰어 + Pinch-to-Zoom',
    href: '/(features)/gallery',
    testID: TestIds.home.galleryCard,
  },
  {
    icon: Newspaper,
    title: '미디어 피드',
    description: 'useInfiniteQuery 무한 스크롤 패턴',
    href: '/(features)/feed',
    testID: TestIds.home.feedCard,
  },
];

function FeatureCard({ icon: Icon, title, description, href, badge, testID }: FeatureCardProps) {
  const router = useRouter();

  return (
    <Pressable testID={testID} onPress={() => router.push(href as Href)}>
      <Card>
        <CardHeader>
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-lg">
              <Icon size={20} className="text-primary" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {badge && (
                  <Badge variant="secondary">
                    <Text>{badge}</Text>
                  </Badge>
                )}
              </View>
              <CardDescription className="mt-1">{description}</CardDescription>
            </View>
            <ChevronRight size={18} className="text-muted-foreground" />
          </View>
        </CardHeader>
      </Card>
    </Pressable>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const plan = useSubscriptionStore((s) => s.plan);

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 mb-6" testID={TestIds.home.screen}>
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

        {/* Subscription Banner */}
        <Pressable onPress={() => {}}>
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <View className="flex-row items-center gap-3">
                <Crown size={20} className="text-primary" />
                <View className="flex-1">
                  <Text className="font-semibold">
                    {plan === 'premium' ? '프리미엄 플랜' : '무료 플랜'}
                  </Text>
                  <Text variant="muted">
                    {plan === 'premium'
                      ? '모든 기능을 자유롭게 사용하세요'
                      : '설정에서 프리미엄으로 업그레이드하세요'}
                  </Text>
                </View>
              </View>
            </CardHeader>
          </Card>
        </Pressable>

        {/* Feature Cards */}
        <Text className="font-semibold text-lg mb-3">샘플 기능</Text>
        <View className="gap-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
