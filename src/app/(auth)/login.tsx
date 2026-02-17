import { useState } from 'react';
import { View, Alert } from 'react-native';
import { Link, type Href } from 'expo-router';
import { SafeArea, KeyboardAwareView } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { TestIds } from '@/lib/utils/testIds';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, isLoading } = useAuthStore();

  const handleLogin = async () => {
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
        <View className="flex-1 justify-center px-6" testID={TestIds.login.screen}>
          <Text variant="h3" className="text-left mb-2">로그인</Text>
          <Text variant="muted" className="mb-10">계정에 로그인하세요</Text>

          <View className="gap-4">
            <View className="gap-1.5">
              <Text variant="small">이메일</Text>
              <Input
                testID={TestIds.login.emailInput}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            <View className="gap-1.5">
              <Text variant="small">비밀번호</Text>
              <Input
                testID={TestIds.login.passwordInput}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>
          </View>

          <Link href={'/(auth)/forgot-password' as Href} asChild>
            <Button variant="link" className="self-end mt-2" testID={TestIds.login.forgotPassword}>
              <Text>비밀번호 찾기</Text>
            </Button>
          </Link>

          <Button
            onPress={handleLogin}
            disabled={isLoading}
            className="mt-4 w-full"
            testID={TestIds.login.submitButton}
          >
            <Text>{isLoading ? '로그인 중...' : '로그인'}</Text>
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text variant="muted">계정이 없으신가요? </Text>
            <Link href={'/(auth)/register' as Href}>
              <Text className="text-primary font-semibold">회원가입</Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareView>
    </SafeArea>
  );
}
