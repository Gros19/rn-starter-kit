import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FilterChips } from '@/components/common/filter-chips';
import { postFormSchema, type PostFormValues } from './post-form-schema';
import type { PostCategory } from '../types';

const CATEGORY_CHIPS: { value: PostCategory; label: string }[] = [
  { value: 'general', label: '일반' },
  { value: 'question', label: '질문' },
  { value: 'tips', label: '팁' },
  { value: 'showcase', label: '쇼케이스' },
];

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function PostForm({ initialValues, onSubmit, isLoading, submitLabel = '작성' }: PostFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      content: initialValues?.content ?? '',
      category: initialValues?.category ?? 'general',
    },
  });

  return (
    <View className="gap-4">
      <View>
        <Text className="text-sm font-medium text-foreground mb-1">카테고리</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <FilterChips
              chips={CATEGORY_CHIPS}
              selected={value}
              onSelect={(v) => onChange(v ?? 'general')}
            />
          )}
        />
        {errors.category && (
          <Text className="text-xs text-destructive mt-1">{errors.category.message}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium text-foreground mb-1">제목</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="제목을 입력하세요"
            />
          )}
        />
        {errors.title && (
          <Text className="text-xs text-destructive mt-1">{errors.title.message}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium text-foreground mb-1">내용</Text>
        <Controller
          control={control}
          name="content"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="내용을 입력하세요"
              multiline
              numberOfLines={8}
              className="min-h-[160px]"
              textAlignVertical="top"
            />
          )}
        />
        {errors.content && (
          <Text className="text-xs text-destructive mt-1">{errors.content.message}</Text>
        )}
      </View>

      <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <Text>{isLoading ? '처리 중...' : submitLabel}</Text>
      </Button>
    </View>
  );
}
