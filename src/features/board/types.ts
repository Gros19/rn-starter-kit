export type PostCategory = 'general' | 'question' | 'tips' | 'showcase';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  author: { id: string; name: string };
  likes: number;
  liked: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: { id: string; name: string };
  likes: number;
  liked: boolean;
  createdAt: string;
}

export interface BoardFilter {
  category?: PostCategory;
  search?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  category: PostCategory;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  category?: PostCategory;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
}
