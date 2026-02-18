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
import { Skeleton } from '@/components/ui/skeleton';
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
import { SearchBar } from '@/components/common/search-bar';
import { FilterChips } from '@/components/common/filter-chips';
import { ProgressBar } from '@/components/common/progress-bar';
import { EmptyState } from '@/components/common/empty-state';
import { LikeButton } from '@/components/common/like-button';
import { RelativeTime } from '@/components/common/relative-time';
import { TestIds } from '@/lib/utils/testIds';
import { Inbox } from 'lucide-react-native';

const DEMO_CHIPS = [
  { label: 'React', value: 'react' },
  { label: 'Native', value: 'native' },
  { label: 'Expo', value: 'expo' },
];

export default function ExploreScreen() {
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedChip, setSelectedChip] = useState<string>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [progress, setProgress] = useState(65);

  return (
    <SafeArea edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 mb-6" testID={TestIds.explore.screen}>
          <Text variant="h3" className="text-left">컴포넌트 쇼케이스</Text>
          <Text variant="muted">RNR 프리미티브 + 커스텀 공통 컴포넌트</Text>
        </View>

        {/* Section: RNR Primitives */}
        <Text className="font-semibold text-lg mb-3">RNR 프리미티브</Text>

        {/* Buttons */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Button</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              <Button><Text>Default</Text></Button>
              <Button variant="secondary"><Text>Secondary</Text></Button>
              <Button variant="outline"><Text>Outline</Text></Button>
              <Button variant="ghost"><Text>Ghost</Text></Button>
              <Button variant="destructive"><Text>Destructive</Text></Button>
              <Button variant="link"><Text>Link</Text></Button>
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
              <Input placeholder="텍스트를 입력하세요..." value={inputValue} onChangeText={setInputValue} />
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
              <Badge><Text>Default</Text></Badge>
              <Badge variant="secondary"><Text>Secondary</Text></Badge>
              <Badge variant="outline"><Text>Outline</Text></Badge>
              <Badge variant="destructive"><Text>Destructive</Text></Badge>
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

        {/* Skeleton */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <View className="flex-1 gap-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </View>
              </View>
              <Skeleton className="h-24 w-full rounded-xl" />
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
                <Button variant="outline"><Text>다이얼로그 열기</Text></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>알림</DialogTitle>
                  <DialogDescription>이것은 다이얼로그 컴포넌트 데모입니다.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button><Text>확인</Text></Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Section: Common Components */}
        <Text className="font-semibold text-lg mb-3 mt-4">공통 컴포넌트</Text>

        {/* SearchBar */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>SearchBar</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="검색어를 입력하세요..."
            />
            {searchValue ? (
              <Text className="text-sm text-muted-foreground mt-2">검색어: &ldquo;{searchValue}&rdquo;</Text>
            ) : null}
          </CardContent>
        </Card>

        {/* FilterChips */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>FilterChips</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterChips
              chips={DEMO_CHIPS}
              selected={selectedChip}
              onSelect={setSelectedChip}
            />
            <Text className="text-sm text-muted-foreground mt-2">
              선택: {selectedChip ?? '없음'}
            </Text>
          </CardContent>
        </Card>

        {/* ProgressBar */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>ProgressBar</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <ProgressBar progress={progress} />
              <Text className="text-sm text-muted-foreground">{progress}%</Text>
              <View className="flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setProgress((p) => Math.max(0, p - 10))}
                >
                  <Text>-10</Text>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setProgress((p) => Math.min(100, p + 10))}
                >
                  <Text>+10</Text>
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* LikeButton */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>LikeButton</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-4">
              <LikeButton
                liked={liked}
                count={likeCount}
                onPress={() => {
                  setLiked(!liked);
                  setLikeCount((c) => liked ? c - 1 : c + 1);
                }}
              />
              <Text className="text-sm text-muted-foreground">탭하여 토글</Text>
            </View>
          </CardContent>
        </Card>

        {/* RelativeTime */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>RelativeTime</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm">방금:</Text>
                <RelativeTime date={new Date()} />
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm">1시간 전:</Text>
                <RelativeTime date={new Date(Date.now() - 3600000)} />
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm">3일 전:</Text>
                <RelativeTime date={new Date(Date.now() - 259200000)} />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* EmptyState */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>EmptyState</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Inbox}
              title="비어있는 상태"
              message="데이터가 없을 때 이 컴포넌트를 표시합니다"
            />
          </CardContent>
        </Card>
      </ScrollView>
    </SafeArea>
  );
}
