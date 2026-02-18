import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Crown } from 'lucide-react-native';
import { useSubscriptionStore } from '../store';

interface UpgradePromptProps {
  message?: string;
}

export function UpgradePrompt({ message = '이 기능은 프리미엄에서 사용 가능합니다' }: UpgradePromptProps) {
  const upgrade = useSubscriptionStore((s) => s.upgrade);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-0 items-center gap-3">
        <Crown size={32} className="text-primary" />
        <Text className="font-semibold text-center">{message}</Text>
        <Button onPress={upgrade} size="sm">
          <Text>프리미엄으로 업그레이드</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
