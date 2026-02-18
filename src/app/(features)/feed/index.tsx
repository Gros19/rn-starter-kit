import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/common/empty-state';
import { FeedItem } from '@/features/feed/components/feed-item';
import { useFeed, useLikeFeedPost } from '@/features/feed/hooks/use-feed';
import { Newspaper } from 'lucide-react-native';
import { useMemo } from 'react';

export default function FeedScreen() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useFeed();
  const likeFeedPost = useLikeFeedPost();

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <>
      <Stack.Screen options={{ title: '피드' }} />
      <SafeArea edges={['top']}>
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : !posts.length ? (
            <EmptyState
              icon={Newspaper}
              title="피드가 비어있습니다"
              message="아직 게시물이 없습니다"
            />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FeedItem
                  post={item}
                  onLike={() => likeFeedPost.mutate(item.id)}
                />
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator size="small" />
                    <Text className="text-xs text-muted-foreground mt-1">더 불러오는 중...</Text>
                  </View>
                ) : !hasNextPage && posts.length > 0 ? (
                  <View className="py-4 items-center">
                    <Text className="text-xs text-muted-foreground">모든 게시물을 불러왔습니다</Text>
                  </View>
                ) : null
              }
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            />
          )}
        </View>
      </SafeArea>
    </>
  );
}
