import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { TestIds } from '@/lib/utils/testIds';

export default function ExploreScreen() {
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 mb-6" testID={TestIds.explore.screen}>
          <Text variant="h3" className="text-left">컴포넌트 쇼케이스</Text>
          <Text variant="muted">React Native Reusables 컴포넌트 데모</Text>
        </View>

        {/* Buttons */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Button</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              <Button>
                <Text>Default</Text>
              </Button>
              <Button variant="secondary">
                <Text>Secondary</Text>
              </Button>
              <Button variant="outline">
                <Text>Outline</Text>
              </Button>
              <Button variant="ghost">
                <Text>Ghost</Text>
              </Button>
              <Button variant="destructive">
                <Text>Destructive</Text>
              </Button>
              <Button variant="link">
                <Text>Link</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <Input
                placeholder="텍스트를 입력하세요..."
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Input placeholder="비활성화" editable={false} />
            </View>
          </CardContent>
        </Card>

        {/* Badge */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              <Badge>
                <Text>Default</Text>
              </Badge>
              <Badge variant="secondary">
                <Text>Secondary</Text>
              </Badge>
              <Badge variant="outline">
                <Text>Outline</Text>
              </Badge>
              <Badge variant="destructive">
                <Text>Destructive</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>

        {/* Switch */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Switch</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center justify-between">
              <Text>알림 활성화</Text>
              <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
            </View>
          </CardContent>
        </Card>

        {/* Separator */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Separator</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>위 내용</Text>
            <Separator className="my-3" />
            <Text>아래 내용</Text>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Text>다이얼로그 열기</Text>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>알림</DialogTitle>
                  <DialogDescription>이것은 다이얼로그 컴포넌트 데모입니다.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>
                      <Text>확인</Text>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeArea>
  );
}
