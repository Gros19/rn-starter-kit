import { FlatList, View, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { LikeButton } from '@/components/common/like-button';
import { RelativeTime } from '@/components/common/relative-time';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { CommentItem } from '@/features/board/components/comment-item';
import { usePost, useLikePost, useDeletePost } from '@/features/board/hooks/use-board';
import { useComments, useCreateComment, useLikeComment } from '@/features/board/hooks/use-comments';
import { Send, Pencil, Trash2, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  general: '일반',
  question: '질문',
  tips: '팁',
  showcase: '쇼케이스',
};

export default function BoardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments, isLoading: commentsLoading } = useComments(id);
  const likePost = useLikePost();
  const deletePost = useDeletePost();
  const createComment = useCreateComment();
  const likeComment = useLikeComment(id);

  const [commentText, setCommentText] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isMyPost = post?.author.id === 'u0';

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    createComment.mutate(
      { postId: id, content: commentText.trim() },
      { onSuccess: () => setCommentText('') },
    );
  };

  const handleDelete = () => {
    deletePost.mutate(id, { onSuccess: () => router.back() });
  };

  if (postLoading) {
    return (
      <SafeArea edges={[]}>
        <View className="p-4 gap-4">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </View>
      </SafeArea>
    );
  }

  if (!post) {
    return (
      <SafeArea edges={[]}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">게시글을 찾을 수 없습니다</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '게시글',
          headerRight: isMyPost
            ? () => (
                <View className="flex-row gap-3">
                  <Pressable onPress={() => router.push(`/(features)/board/edit/${id}` as never)}>
                    <Pencil size={20} className="text-foreground" />
                  </Pressable>
                  <Pressable onPress={() => setShowDeleteDialog(true)}>
                    <Trash2 size={20} className="text-destructive" />
                  </Pressable>
                </View>
              )
            : undefined,
        }}
      />
      <SafeArea edges={[]}>
        <View className="flex-1">
          <FlatList
            data={comments ?? []}
            keyExtractor={(item) => item.id}
            contentContainerClassName="pb-4"
            ListHeaderComponent={
              <View className="p-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    <Text className="text-xs">{CATEGORY_LABELS[post.category]}</Text>
                  </Badge>
                  <Text className="text-sm text-muted-foreground">{post.author.name}</Text>
                  <RelativeTime date={post.createdAt} />
                </View>

                <Text className="text-xl font-bold text-foreground mb-3">{post.title}</Text>
                <Text className="text-base text-foreground leading-6 mb-4">{post.content}</Text>

                <View className="flex-row items-center gap-4 mb-4">
                  <LikeButton
                    liked={post.liked}
                    count={post.likes}
                    onPress={() => likePost.mutate(id)}
                  />
                  <View className="flex-row items-center gap-1">
                    <MessageSquare size={16} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">{post.commentCount}</Text>
                  </View>
                </View>

                <Separator />

                <Text className="text-base font-semibold text-foreground mt-4 mb-2">
                  댓글 {post.commentCount}
                </Text>

                {commentsLoading && (
                  <View className="gap-3 mt-2">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </View>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View className="px-4">
                <CommentItem
                  comment={item}
                  onLike={() => likeComment.mutate(item.id)}
                />
              </View>
            )}
            ListEmptyComponent={
              !commentsLoading ? (
                <View className="px-4 py-8 items-center">
                  <Text className="text-muted-foreground">아직 댓글이 없습니다</Text>
                </View>
              ) : null
            }
          />

          {/* Comment Input */}
          <View className="flex-row items-center gap-2 p-3 border-t border-border bg-background">
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="댓글을 입력하세요..."
              className="flex-1 bg-muted rounded-full px-4 py-2 text-sm text-foreground"
              placeholderTextColor="#9ca3af"
            />
            <Pressable
              onPress={handleSendComment}
              disabled={!commentText.trim() || createComment.isPending}
              className="w-10 h-10 rounded-full bg-primary items-center justify-center active:bg-primary/90 disabled:opacity-50"
            >
              <Send size={18} className="text-primary-foreground" />
            </Pressable>
          </View>
        </View>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="게시글 삭제"
          description="이 게시글을 삭제하시겠습니까? 댓글도 모두 삭제됩니다."
          variant="destructive"
          confirmLabel="삭제"
          onConfirm={handleDelete}
        />
      </SafeArea>
    </>
  );
}
