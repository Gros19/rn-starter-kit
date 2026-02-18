import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/common/search-bar';
import { FilterChips } from '@/components/common/filter-chips';
import { EmptyState } from '@/components/common/empty-state';
import { FAB } from '@/components/common/fab';
import { PostItem } from '@/features/board/components/post-item';
import { usePosts, useLikePost } from '@/features/board/hooks/use-board';
import { useBoardFilters } from '@/features/board/hooks/use-board-filters';
import type { PostCategory } from '@/features/board/types';
import { Plus, FileText } from 'lucide-react-native';

const CATEGORY_CHIPS: { label: string; value: PostCategory }[] = [
  { label: '일반', value: 'general' },
  { label: '질문', value: 'question' },
  { label: '팁', value: 'tips' },
  { label: '쇼케이스', value: 'showcase' },
];

export default function BoardListScreen() {
  const router = useRouter();
  const { filter, setCategory, setSearch } = useBoardFilters();
  const { data: posts, isLoading } = usePosts(filter);
  const likePost = useLikePost();

  return (
    <SafeArea edges={['top']}>
      <View className="flex-1">
        <View className="px-4 pt-2 gap-3">
          <SearchBar
            value={filter.search ?? ''}
            onChangeText={setSearch}
            placeholder="게시글 검색..."
          />
          <FilterChips
            chips={CATEGORY_CHIPS}
            selected={filter.category}
            onSelect={setCategory}
          />
        </View>

        {isLoading ? (
          <View className="px-4 pt-4 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </View>
        ) : !posts?.length ? (
          <EmptyState
            icon={FileText}
            title="게시글이 없습니다"
            message="첫 번째 글을 작성해보세요"
            actionLabel="글 작성"
            onAction={() => router.push('/(features)/board/create' as never)}
          />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-4 pt-4 pb-24 gap-3"
            renderItem={({ item }) => (
              <PostItem
                post={item}
                onPress={() => router.push(`/(features)/board/${item.id}` as never)}
                onLike={() => likePost.mutate(item.id)}
              />
            )}
          />
        )}

        <FAB
          icon={Plus}
          onPress={() => router.push('/(features)/board/create' as never)}
        />
      </View>
    </SafeArea>
  );
}
