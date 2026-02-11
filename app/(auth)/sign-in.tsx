import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, type Href } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Button, Input, Divider } from '@/components/ui';
import { SocialLoginButton } from '@/components/auth/social-login-button';
import { KeyboardAwareView } from '@/components/layout';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, isLoading } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      Alert.alert('로그인 실패', error instanceof Error ? error.message : '다시 시도해주세요.');
    }
  };

  return (
    <SafeArea>
      <KeyboardAwareView>
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            로그인
          </Text>
          <Text className="text-base text-neutral-500 mb-10">
            계정에 로그인하세요
          </Text>

          <View className="gap-4 mb-6">
            <SocialLoginButton provider="apple" />
            <SocialLoginButton provider="google" />
            <SocialLoginButton provider="kakao" />
          </View>

          <Divider label="또는" className="mb-6" />

          <View className="gap-4">
            <Input
              label="이메일"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="비밀번호"
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <Button
            title="로그인"
            onPress={handleSignIn}
            loading={isLoading}
            fullWidth
            className="mt-6"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-500">계정이 없으신가요? </Text>
            <Link href={'/(auth)/sign-up' as Href}>
              <Text className="text-primary-500 font-semibold">회원가입</Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareView>
    </SafeArea>
  );
}
