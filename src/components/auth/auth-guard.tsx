import { type PropsWithChildren, useEffect } from 'react';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useAppStore } from '@/lib/stores/app-store';
import { LoadingScreen } from '@/components/common/loading-screen';

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized || !hasHydrated) return;

    const inAuthGroup = segments[0] === ('(auth)' as string);
    const inOnboarding = segments[0] === ('onboarding' as string);

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login' as Href);
    } else if (isAuthenticated && inAuthGroup) {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding' as Href);
      } else {
        router.replace('/(tabs)' as Href);
      }
    } else if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding' as Href);
    }
  }, [isAuthenticated, isInitialized, hasHydrated, hasCompletedOnboarding, segments, router]);

  if (!isInitialized || !hasHydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
