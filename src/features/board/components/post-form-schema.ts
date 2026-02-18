import { z } from 'zod';

export const postFormSchema = z.object({
  title: z
    .string()
    .min(2, '제목은 2자 이상이어야 합니다')
    .max(100, '제목은 100자 이하여야 합니다'),
  content: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다')
    .max(5000, '내용은 5000자 이하여야 합니다'),
  category: z.enum(['general', 'question', 'tips', 'showcase'], {
    message: '카테고리를 선택해주세요',
  }),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
