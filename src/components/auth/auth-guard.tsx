import { type PropsWithChildren, useEffect } from 'react';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useAuthStore } from '@/lib/stores/auth-store';
import { LoadingScreen } from '@/components/common/loading-screen';

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
      router.replace('/(auth)/login' as Href);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as Href);
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
