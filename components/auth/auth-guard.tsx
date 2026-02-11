import { type PropsWithChildren, useEffect } from 'react';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useAuthStore } from '@/lib/stores/auth-store';
import { View, ActivityIndicator } from 'react-native';

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === ('(auth)' as string);

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in' as Href);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return <>{children}</>;
}
