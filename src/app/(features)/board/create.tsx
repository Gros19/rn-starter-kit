import { ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { PostForm } from '@/features/board/components/post-form';
import { useCreatePost } from '@/features/board/hooks/use-board';
import type { PostFormValues } from '@/features/board/components/post-form-schema';

export default function BoardCreateScreen() {
  const router = useRouter();
  const createPost = useCreatePost();

  const handleSubmit = (values: PostFormValues) => {
    createPost.mutate(values, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: '글 작성' }} />
      <SafeArea edges={[]}>
        <ScrollView
          contentContainerClassName="p-4"
          keyboardShouldPersistTaps="handled"
        >
          <PostForm onSubmit={handleSubmit} isLoading={createPost.isPending} />
        </ScrollView>
      </SafeArea>
    </>
  );
}
