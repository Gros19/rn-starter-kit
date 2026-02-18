import { FlatList, Pressable, Image, useWindowDimensions } from 'react-native';
import { cn } from '@/lib/utils';

interface ImageGridItem {
  id: string;
  uri: string;
}

interface ImageGridProps<T extends ImageGridItem> {
  items: T[];
  onPress: (item: T) => void;
  numColumns?: number;
  gap?: number;
  className?: string;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
}

export function ImageGrid<T extends ImageGridItem>({
  items,
  onPress,
  numColumns = 3,
  gap = 2,
  className,
  ListEmptyComponent,
  ListHeaderComponent,
}: ImageGridProps<T>) {
  const { width } = useWindowDimensions();
  const cellSize = (width - gap * (numColumns + 1)) / numColumns;

  return (
    <FlatList
      data={items}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap, padding: gap }}
      columnWrapperStyle={{ gap }}
      className={cn('flex-1', className)}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress(item)} className="active:opacity-80">
          <Image
            source={{ uri: item.uri }}
            style={{ width: cellSize, height: cellSize }}
            className="rounded-sm bg-muted"
          />
        </Pressable>
      )}
    />
  );
}
