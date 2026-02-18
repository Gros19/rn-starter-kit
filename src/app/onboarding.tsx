import { useRef, useState } from 'react';
import { View, FlatList, Dimensions, type ViewToken } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/stores/app-store';
import { TestIds } from '@/lib/utils/testIds';
import { CheckCircle, Layers, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingPage {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const PAGES: OnboardingPage[] = [
  {
    id: '1',
    icon: Zap,
    title: '빠르게 시작하세요',
    description: 'Expo SDK 54 기반의 프로덕션 레디 스타터킷으로 즉시 개발을 시작할 수 있습니다.',
  },
  {
    id: '2',
    icon: Layers,
    title: '완벽한 구조',
    description: '인증, 상태관리, API 클라이언트 등 필수 인프라가 모두 준비되어 있습니다.',
  },
  {
    id: '3',
    icon: CheckCircle,
    title: '준비 완료',
    description: 'Todo, 파일 업로드, 알림 등 샘플 기능으로 패턴을 익히고 바로 확장하세요.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleComplete = () => {
    setOnboardingComplete();
    router.replace('/(tabs)' as Href);
  };

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
    } else {
      handleComplete();
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentPage(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  return (
    <View className="flex-1 bg-background" testID={TestIds.onboarding.screen}>
      <FlatList
        ref={flatListRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={{ width }} className="flex-1 items-center justify-center px-8">
              <View className="bg-primary/10 p-6 rounded-full mb-8">
                <Icon size={48} className="text-primary" />
              </View>
              <Text variant="h3" className="text-center mb-3">{item.title}</Text>
              <Text variant="muted" className="text-center text-base">{item.description}</Text>
            </View>
          );
        }}
      />

      {/* Dots */}
      <View className="flex-row justify-center gap-2 mb-4">
        {PAGES.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentPage ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          />
        ))}
      </View>

      {/* Buttons */}
      <View className="px-8 pb-12 gap-3">
        <Button testID={TestIds.onboarding.nextButton} onPress={handleNext}>
          <Text>{currentPage === PAGES.length - 1 ? '시작하기' : '다음'}</Text>
        </Button>
        {currentPage < PAGES.length - 1 && (
          <Button testID={TestIds.onboarding.skipButton} variant="ghost" onPress={handleComplete}>
            <Text>건너뛰기</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
