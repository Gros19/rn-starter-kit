import { Platform, Pressable, Text, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import type { AuthProvider } from '@/lib/types/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

interface SocialLoginButtonProps {
  provider: AuthProvider;
}

const providerConfig: Record<
  Exclude<AuthProvider, 'email'>,
  { label: string; bgClass: string; textClass: string }
> = {
  apple: {
    label: 'Apple로 계속하기',
    bgClass: 'bg-black dark:bg-white',
    textClass: 'text-white dark:text-black',
  },
  google: {
    label: 'Google로 계속하기',
    bgClass: 'bg-white border border-neutral-200',
    textClass: 'text-neutral-900',
  },
  kakao: {
    label: '카카오로 계속하기',
    bgClass: 'bg-[#FEE500]',
    textClass: 'text-[#191919]',
  },
};

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
  const { signInWithSocial, isLoading } = useAuthStore();

  if (provider === 'email') return null;

  // Apple 로그인: iOS에서 네이티브 버튼 사용
  if (provider === 'apple') {
    if (Platform.OS !== 'ios') return null;

    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={12}
        style={{ height: 50 }}
        onPress={() => signInWithSocial('apple')}
      />
    );
  }

  const config = providerConfig[provider];

  return (
    <Pressable
      onPress={() => signInWithSocial(provider)}
      disabled={isLoading}
      className={`flex-row items-center justify-center py-3.5 rounded-xl ${config.bgClass} ${isLoading ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={config.label}
    >
      <View className="w-6 h-6 mr-2" />
      <Text className={`text-base font-semibold ${config.textClass}`}>{config.label}</Text>
    </Pressable>
  );
}
