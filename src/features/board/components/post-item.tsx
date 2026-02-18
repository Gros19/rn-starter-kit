import { Pressable, View } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { LikeButton } from '@/components/common/like-button';
import { RelativeTime } from '@/components/common/relative-time';
import type { Post, PostCategory } from '../types';

const CATEGORY_LABELS: Record<PostCategory, string> = {
  general: '일반',
  question: '질문',
  tips: '팁',
  showcase: '쇼케이스',
};

const CATEGORY_VARIANTS: Record<PostCategory, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  general: 'secondary',
  question: 'default',
  tips: 'outline',
  showcase: 'outline',
};

interface PostItemProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
}

export function PostItem({ post, onPress, onLike }: PostItemProps) {
  const excerpt = post.content.length > 80
    ? post.content.slice(0, 80) + '...'
    : post.content;

  return (
    <Pressable
      onPress={onPress}
      className="bg-card border border-border rounded-xl p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Badge variant={CATEGORY_VARIANTS[post.category]}>
          <Text className="text-xs">{CATEGORY_LABELS[post.category]}</Text>
        </Badge>
        <Text className="text-xs text-muted-foreground">{post.author.name}</Text>
        <RelativeTime date={post.createdAt} />
      </View>

      <Text className="text-base font-semibold text-foreground mb-1">
        {post.title}
      </Text>
      <Text className="text-sm text-muted-foreground mb-3">
        {excerpt}
      </Text>

      <View className="flex-row items-center gap-4">
        <LikeButton liked={post.liked} count={post.likes} onPress={onLike} />
        <View className="flex-row items-center gap-1">
          <MessageSquare size={16} className="text-muted-foreground" />
          <Text className="text-xs text-muted-foreground">{post.commentCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}
