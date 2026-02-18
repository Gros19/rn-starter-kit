export interface FeedPost {
  id: string;
  imageUri: string;
  author: { id: string; name: string; avatar: string };
  caption: string;
  likes: number;
  liked: boolean;
  commentCount: number;
  createdAt: string;
}
