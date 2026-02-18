import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as feedMock from '../mock';
import type { FeedPost } from '../types';
import type { PaginatedResponse } from '@/lib/types/common';

const FEED_KEY = ['feed'] as const;

export function useFeed() {
  return useInfiniteQuery({
    queryKey: FEED_KEY,
    queryFn: ({ pageParam }) => feedMock.getFeedPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<FeedPost>) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useLikeFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feedMock.likeFeedPost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: FEED_KEY });

      const previous = queryClient.getQueryData(FEED_KEY);

      queryClient.setQueryData(FEED_KEY, (old: { pages: PaginatedResponse<FeedPost>[]; pageParams: number[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === id
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post,
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FEED_KEY, context.previous);
      }
    },
  });
}
