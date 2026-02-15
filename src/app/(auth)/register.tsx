import { useState } from 'react';
import { View, Alert } from 'react-native';
import { Link, type Href } from 'expo-router';
import { SafeArea, KeyboardAwareView } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { TestIds } from '@/lib/utils/testIds';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUpWithEmail, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('입력 오류', '비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    try {
      await signUpWithEmail(email, password, name);
    } catch (error) {
      Alert.alert('회원가입 실패', error instanceof Error ? error.message : '다시 시도해주세요.');
    }
  };

  return (
    <SafeArea>
      <KeyboardAwareView>
        <View className="flex-1 justify-center px-6" testID={TestIds.signup.screen}>
          <Text variant="h3" className="text-left mb-2">회원가입</Text>
          <Text variant="muted" className="mb-10">새 계정을 만드세요</Text>

          <View className="gap-4">
            <View className="gap-1.5">
              <Text variant="small">이름</Text>
              <Input
                placeholder="홍길동"
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            </View>
            <View className="gap-1.5">
              <Text variant="small">이메일</Text>
              <Input
                testID={TestIds.signup.emailInput}
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
                testID={TestIds.signup.passwordInput}
                placeholder="8자 이상"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
            <View className="gap-1.5">
              <Text variant="small">비밀번호 확인</Text>
              <Input
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Button
            onPress={handleRegister}
            disabled={isLoading}
            className="mt-6 w-full"
            testID={TestIds.signup.submitButton}
          >
            <Text>{isLoading ? '가입 중...' : '회원가입'}</Text>
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text variant="muted">이미 계정이 있으신가요? </Text>
            <Link href={'/(auth)/login' as Href}>
              <Text className="text-primary font-semibold">로그인</Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareView>
    </SafeArea>
  );
}
