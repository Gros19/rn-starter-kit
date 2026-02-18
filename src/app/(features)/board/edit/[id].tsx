import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { PostForm } from '@/features/board/components/post-form';
import { usePost, useUpdatePost } from '@/features/board/hooks/use-board';
import type { PostFormValues } from '@/features/board/components/post-form-schema';

export default function BoardEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading } = usePost(id);
  const updatePost = useUpdatePost();

  const handleSubmit = (values: PostFormValues) => {
    updatePost.mutate(
      { id, ...values },
      { onSuccess: () => router.back() },
    );
  };

  if (isLoading) {
    return (
      <SafeArea edges={[]}>
        <View className="p-4 gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
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
      <Stack.Screen options={{ title: '글 수정' }} />
      <SafeArea edges={[]}>
        <ScrollView
          contentContainerClassName="p-4"
          keyboardShouldPersistTaps="handled"
        >
          <PostForm
            initialValues={{
              title: post.title,
              content: post.content,
              category: post.category,
            }}
            onSubmit={handleSubmit}
            isLoading={updatePost.isPending}
            submitLabel="수정"
          />
        </ScrollView>
      </SafeArea>
    </>
  );
}
