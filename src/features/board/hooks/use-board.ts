import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as boardMock from '../mock';
import type { Post, BoardFilter, CreatePostPayload, UpdatePostPayload } from '../types';

const POSTS_KEY = ['posts'] as const;

export function usePosts(filter?: BoardFilter) {
  return useQuery({
    queryKey: [...POSTS_KEY, filter],
    queryFn: () => boardMock.getPosts(filter),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: [...POSTS_KEY, id],
    queryFn: () => boardMock.getPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => boardMock.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePostPayload & { id: string }) =>
      boardMock.updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardMock.deletePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: POSTS_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_KEY);
      queryClient.setQueriesData<Post[]>(
        { queryKey: POSTS_KEY },
        (old) => old?.filter((p) => p.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: POSTS_KEY }, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => boardMock.likePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: POSTS_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_KEY);
      queryClient.setQueriesData<Post[]>(
        { queryKey: POSTS_KEY },
        (old) =>
          old?.map((p) =>
            p.id === id
              ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
              : p,
          ),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: POSTS_KEY }, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}
