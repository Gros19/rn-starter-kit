import { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea, KeyboardAwareView } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  const handleSend = () => {
    if (!email) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }
    // TODO: API 연동
    setIsSent(true);
  };

  if (isSent) {
    return (
      <SafeArea>
        <View className="flex-1 justify-center px-6 items-center">
          <Text variant="h3" className="mb-4">이메일 전송 완료</Text>
          <Text variant="muted" className="text-center mb-8">
            {email}로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요.
          </Text>
          <Button onPress={() => router.back()} variant="outline">
            <Text>로그인으로 돌아가기</Text>
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <KeyboardAwareView>
        <View className="flex-1 justify-center px-6">
          <Text variant="h3" className="text-left mb-2">비밀번호 찾기</Text>
          <Text variant="muted" className="mb-10">
            가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
          </Text>

          <View className="gap-1.5">
            <Text variant="small">이메일</Text>
            <Input
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <Button onPress={handleSend} className="mt-6 w-full">
            <Text>재설정 링크 보내기</Text>
          </Button>

          <Button onPress={() => router.back()} variant="ghost" className="mt-3">
            <Text>뒤로 가기</Text>
          </Button>
        </View>
      </KeyboardAwareView>
    </SafeArea>
  );
}
