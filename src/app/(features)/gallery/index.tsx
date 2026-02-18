import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { ImageGrid } from '@/components/common/image-grid';
import { ImageViewer } from '@/features/gallery/components/image-viewer';
import { useGallery } from '@/features/gallery/hooks/use-gallery';
import type { MediaItem } from '@/features/gallery/types';
import { ImageIcon } from 'lucide-react-native';
import { useState } from 'react';

export default function GalleryScreen() {
  const { data: items, isLoading } = useGallery();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  return (
    <>
      <Stack.Screen options={{ title: '갤러리' }} />
      <SafeArea edges={['top']}>
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-row flex-wrap gap-0.5 p-0.5">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="w-[33%] aspect-square" />
              ))}
            </View>
          ) : !items?.length ? (
            <EmptyState
              icon={ImageIcon}
              title="사진이 없습니다"
              message="갤러리에 사진을 추가해보세요"
            />
          ) : (
            <ImageGrid
              items={items}
              onPress={(item) => setSelectedItem(item)}
            />
          )}

          <ImageViewer
            item={selectedItem}
            visible={!!selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </View>
      </SafeArea>
    </>
  );
}
