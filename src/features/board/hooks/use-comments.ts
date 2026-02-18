import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as boardMock from '../mock';
import type { Comment, CreateCommentPayload } from '../types';

const commentsKey = (postId: string) => ['posts', postId, 'comments'] as const;

export function useComments(postId: string) {
  return useQuery({
    queryKey: commentsKey(postId),
    queryFn: () => boardMock.getComments(postId),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => boardMock.createComment(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentsKey(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikeComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => boardMock.likeComment(commentId),
    onMutate: async (commentId) => {
      const key = commentsKey(postId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Comment[]>(key);
      queryClient.setQueryData<Comment[]>(key, (old) =>
        old?.map((c) =>
          c.id === commentId
            ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
            : c,
        ),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentsKey(postId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
    },
  });
}
