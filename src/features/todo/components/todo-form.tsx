import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FilterChips } from '@/components/common/filter-chips';
import type { TodoPriority, CreateTodoPayload, Todo } from '../types';

const PRIORITY_CHIPS: { label: string; value: TodoPriority }[] = [
  { label: '낮음', value: 'low' },
  { label: '보통', value: 'medium' },
  { label: '높음', value: 'high' },
];

interface TodoFormProps {
  initialData?: Todo;
  onSubmit: (data: CreateTodoPayload) => void;
  isLoading?: boolean;
}

export function TodoForm({ initialData, onSubmit, isLoading }: TodoFormProps) {
  const { control, handleSubmit, setValue, watch } = useForm<CreateTodoPayload>({
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: initialData?.priority ?? 'medium',
    },
  });

  const priority = watch('priority');

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="font-medium">제목</Text>
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder="할 일을 입력하세요"
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text className="font-medium">설명 (선택)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              placeholder="상세 설명"
              multiline
              numberOfLines={3}
              className="h-20"
              textAlignVertical="top"
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text className="font-medium">우선순위</Text>
        <FilterChips
          chips={PRIORITY_CHIPS}
          selected={priority}
          onSelect={(val) => setValue('priority', val ?? 'medium')}
        />
      </View>

      <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <Text>{initialData ? '수정' : '추가'}</Text>
      </Button>
    </View>
  );
}
