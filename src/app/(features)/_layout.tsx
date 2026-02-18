import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FeaturesLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <Stack
      screenOptions={{
        headerBackTitle: '뒤로',
        headerLeft: () => (
          <Pressable
            testID="features-back-button"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ marginRight: 8 }}
          >
            <ChevronLeft size={24} color={iconColor} />
          </Pressable>
        ),
      }}
    />
  );
}
