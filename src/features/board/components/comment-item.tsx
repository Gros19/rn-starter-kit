import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { LikeButton } from '@/components/common/like-button';
import { RelativeTime } from '@/components/common/relative-time';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

export function CommentItem({ comment, onLike }: CommentItemProps) {
  return (
    <View className="flex-row gap-3 py-3">
      <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
        <Text className="text-xs font-semibold text-primary">
          {getInitials(comment.author.name)}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-sm font-medium text-foreground">{comment.author.name}</Text>
          <RelativeTime date={comment.createdAt} />
        </View>
        <Text className="text-sm text-foreground mb-1">{comment.content}</Text>
        <LikeButton liked={comment.liked} count={comment.likes} onPress={onLike} size={14} />
      </View>
    </View>
  );
}
