import { useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Crown, X } from 'lucide-react-native';
import { SafeArea } from '@/components/layout';
import { Button } from '@/components/ui';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';
import type { SubscriptionPlan } from '@/lib/types/subscription';

export function Paywall() {
  const { plans, restore, isLoading } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    plans.find((p) => p.period === 'yearly') ?? plans[0] ?? null,
  );
  const router = useRouter();

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    // 실제 구현: react-native-iap로 구매 → 영수증 → verifyReceipt
    Alert.alert('구매', `${selectedPlan.price}/월 구독을 시작합니다. (IAP 연동 필요)`);
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('완료', '구매가 복원되었습니다.');
    } catch (error) {
      Alert.alert('실패', error instanceof Error ? error.message : '복원 실패');
    }
  };

  return (
    <SafeArea>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-4">
          {/* 닫기 */}
          <Pressable
            onPress={() => router.back()}
            className="self-end p-2"
            accessibilityLabel="닫기"
          >
            <X size={24} color="#737373" />
          </Pressable>

          {/* 헤더 */}
          <View className="items-center mt-4 mb-8">
            <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-4">
              <Crown size={32} color="#0a7ea4" />
            </View>
            <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Premium 구독
            </Text>
            <Text className="text-base text-neutral-500 text-center">
              모든 기능을 제한 없이 사용하세요
            </Text>
          </View>

          {/* 플랜 선택 */}
          <View className="gap-3 mb-6">
            {plans.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan)}
                className={`border-2 rounded-2xl p-4 ${
                  selectedPlan?.id === plan.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {plan.period === 'yearly' ? '연간 플랜' : '월간 플랜'}
                    </Text>
                    <Text className="text-sm text-neutral-500 mt-0.5">
                      {plan.pricePerMonth}/월
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-primary-500">{plan.price}</Text>
                </View>
                {plan.period === 'yearly' && (
                  <View className="bg-primary-500 self-start px-2 py-0.5 rounded-full mt-2">
                    <Text className="text-xs text-white font-medium">33% 할인</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* 기능 목록 */}
          <View className="mb-8 gap-3">
            {(selectedPlan?.features ?? []).map((feature, i) => (
              <View key={i} className="flex-row items-center">
                <Check size={18} color="#22C55E" />
                <Text className="ml-2 text-base text-neutral-700 dark:text-neutral-300">
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* 구매 버튼 */}
          <View className="mt-auto pb-4 gap-3">
            <Button
              title={selectedPlan ? `${selectedPlan.price}로 구독하기` : '플랜을 선택하세요'}
              onPress={handlePurchase}
              loading={isLoading}
              fullWidth
              size="lg"
              disabled={!selectedPlan}
            />
            {/* App Store 정책: 복원 버튼 필수 */}
            <Button
              title="이전 구매 복원"
              onPress={handleRestore}
              variant="ghost"
              fullWidth
              size="sm"
            />
          </View>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
