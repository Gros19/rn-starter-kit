import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, type Href } from 'expo-router';
import { SafeArea, KeyboardAwareView } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUpWithEmail, isLoading } = useAuthStore();

  const handleSignUp = async () => {
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
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            회원가입
          </Text>
          <Text className="text-base text-neutral-500 mb-10">
            새 계정을 만드세요
          </Text>

          <View className="gap-4">
            <Input
              label="이름"
              placeholder="홍길동"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
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
              placeholder="8자 이상"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            <Input
              label="비밀번호 확인"
              placeholder="비밀번호 재입력"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <Button
            title="회원가입"
            onPress={handleSignUp}
            loading={isLoading}
            fullWidth
            className="mt-6"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-500">이미 계정이 있으신가요? </Text>
            <Link href={'/(auth)/sign-in' as Href}>
              <Text className="text-primary-500 font-semibold">로그인</Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareView>
    </SafeArea>
  );
}
