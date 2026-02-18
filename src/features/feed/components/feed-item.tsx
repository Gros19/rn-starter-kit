import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { LikeButton } from '@/components/common/like-button';
import { RelativeTime } from '@/components/common/relative-time';
import { MessageSquare } from 'lucide-react-native';
import type { FeedPost } from '../types';

interface FeedItemProps {
  post: FeedPost;
  onLike: () => void;
}

export function FeedItem({ post, onLike }: FeedItemProps) {
  return (
    <View className="bg-card border-b border-border">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
          <Text className="text-sm">{post.author.avatar}</Text>
        </View>
        <Text className="text-sm font-semibold text-foreground flex-1">{post.author.name}</Text>
        <RelativeTime date={post.createdAt} />
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.imageUri }}
        className="w-full aspect-[3/2] bg-muted"
        resizeMode="cover"
      />

      {/* Actions */}
      <View className="flex-row items-center gap-4 px-4 py-3">
        <LikeButton liked={post.liked} count={post.likes} onPress={onLike} />
        <View className="flex-row items-center gap-1">
          <MessageSquare size={18} className="text-muted-foreground" />
          <Text className="text-xs text-muted-foreground">{post.commentCount}</Text>
        </View>
      </View>

      {/* Caption */}
      <View className="px-4 pb-3">
        <Text className="text-sm text-foreground">
          <Text className="font-semibold">{post.author.name}</Text>{' '}
          {post.caption}
        </Text>
      </View>
    </View>
  );
}
