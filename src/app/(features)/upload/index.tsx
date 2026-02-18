import { FlatList, View, Alert, Pressable } from 'react-native';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { FAB } from '@/components/common/fab';
import { ImageGrid } from '@/components/common/image-grid';
import { UploadItemCard } from '@/features/upload/components/upload-item';
import { UploadSourceSheet } from '@/features/upload/components/upload-source-sheet';
import { useUploadQueue } from '@/features/upload/hooks/use-upload-queue';
import { useImagePicker } from '@/features/upload/hooks/use-image-picker';
import { useDocumentPicker } from '@/features/upload/hooks/use-document-picker';
import { useSubscriptionStore } from '@/features/subscription/store';
import { Upload, Plus, List, Grid } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { TestIds } from '@/lib/utils/testIds';
import { cn } from '@/lib/utils';

const MAX_FREE_SIZE = 10 * 1024 * 1024; // 10MB

type ViewMode = 'list' | 'gallery';

export default function UploadScreen() {
  const { items, addItem, removeItem, retryItem, clearCompleted } = useUploadQueue();
  const { pickFromGallery, takePhoto } = useImagePicker();
  const { pickDocument } = useDocumentPicker();
  const canUseLargeUpload = useSubscriptionStore((s) => s.canUse)('large_upload');

  const [showSourceSheet, setShowSourceSheet] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleFilePicked = (file: { uri: string; name: string; size: number; mimeType: string } | null) => {
    if (!file) return;

    if (!canUseLargeUpload && file.size > MAX_FREE_SIZE) {
      Alert.alert(
        '파일 크기 제한',
        '무료 플랜에서는 10MB 이하 파일만 업로드 가능합니다.\n프리미엄으로 업그레이드하세요.',
      );
      return;
    }

    addItem(file.uri, file.name, file.size, file.mimeType);
  };

  const completedCount = items.filter((i) => i.status === 'success').length;

  const galleryItems = useMemo(
    () =>
      items
        .filter((i) => i.status === 'success' && i.mimeType.startsWith('image/'))
        .map((i) => ({ id: i.id, uri: i.uri })),
    [items],
  );

  return (
    <SafeArea edges={['top']}>
      <View className="flex-1" testID={TestIds.upload.screen}>
        {/* View Mode Toggle */}
        <View className="flex-row items-center justify-between px-4 pt-2">
          <View className="flex-row bg-muted rounded-lg overflow-hidden">
            <Pressable
              onPress={() => setViewMode('list')}
              className={cn('px-3 py-1.5', viewMode === 'list' && 'bg-primary')}
            >
              <List size={18} className={viewMode === 'list' ? 'text-primary-foreground' : 'text-foreground'} />
            </Pressable>
            <Pressable
              onPress={() => setViewMode('gallery')}
              className={cn('px-3 py-1.5', viewMode === 'gallery' && 'bg-primary')}
            >
              <Grid size={18} className={viewMode === 'gallery' ? 'text-primary-foreground' : 'text-foreground'} />
            </Pressable>
          </View>

          {completedCount > 0 && viewMode === 'list' && (
            <Button variant="ghost" size="sm" onPress={clearCompleted}>
              <Text>완료 지우기 ({completedCount})</Text>
            </Button>
          )}
        </View>

        {viewMode === 'list' ? (
          // List View
          items.length === 0 ? (
            <EmptyState
              icon={Upload}
              title="업로드한 파일이 없습니다"
              message="사진, 문서 등을 업로드해보세요"
              actionLabel="파일 선택"
              onAction={() => setShowSourceSheet(true)}
            />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-4 pt-4 pb-24 gap-3"
              renderItem={({ item }) => (
                <UploadItemCard
                  item={item}
                  onRetry={() => retryItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              )}
            />
          )
        ) : (
          // Gallery View
          galleryItems.length === 0 ? (
            <EmptyState
              icon={Grid}
              title="이미지가 없습니다"
              message="이미지를 업로드하면 여기에 표시됩니다"
            />
          ) : (
            <ImageGrid
              items={galleryItems}
              onPress={() => {}}
            />
          )
        )}

        <FAB
          icon={Plus}
          onPress={() => setShowSourceSheet(true)}
          testID={TestIds.upload.addButton}
        />

        <UploadSourceSheet
          open={showSourceSheet}
          onOpenChange={setShowSourceSheet}
          onSelectCamera={async () => handleFilePicked(await takePhoto())}
          onSelectGallery={async () => handleFilePicked(await pickFromGallery())}
          onSelectDocument={async () => handleFilePicked(await pickDocument())}
        />
      </View>
    </SafeArea>
  );
}
