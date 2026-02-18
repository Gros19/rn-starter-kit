import type { FeedPost } from './types';
import type { PaginatedResponse } from '@/lib/types/common';
import { mockDelay } from '@/lib/mock/delay';

const AUTHORS = [
  { id: 'u1', name: '김개발', avatar: '🧑‍💻' },
  { id: 'u2', name: '이디자인', avatar: '🎨' },
  { id: 'u3', name: '박아키텍트', avatar: '🏗️' },
  { id: 'u4', name: '최프론트', avatar: '💻' },
  { id: 'u5', name: '정모바일', avatar: '📱' },
];

const CAPTIONS = [
  '오늘의 코딩 결과물 ✨',
  '새로운 UI 디자인 작업 중!',
  '카페에서 작업하는 중 ☕',
  '프로젝트 마일스톤 달성! 🎉',
  'React Native 정말 좋다',
  '주말에도 사이드 프로젝트 🚀',
  '디버깅의 늪에서 탈출!',
  '새로운 라이브러리 발견 📚',
  '코드 리뷰 완료 ✅',
  '드디어 배포 성공!',
];

let feedPosts: FeedPost[] = Array.from({ length: 50 }, (_, i) => ({
  id: `feed-${i + 1}`,
  imageUri: `https://picsum.photos/seed/feed${i + 1}/600/400`,
  author: AUTHORS[i % AUTHORS.length],
  caption: CAPTIONS[i % CAPTIONS.length],
  likes: Math.floor(Math.random() * 100),
  liked: Math.random() > 0.7,
  commentCount: Math.floor(Math.random() * 20),
  createdAt: new Date(2026, 1, 17 - Math.floor(i / 5), 20 - (i % 24)).toISOString(),
}));

const PAGE_SIZE = 10;

export async function getFeedPosts(page: number = 1): Promise<PaginatedResponse<FeedPost>> {
  await mockDelay(600);
  const start = (page - 1) * PAGE_SIZE;
  const data = feedPosts.slice(start, start + PAGE_SIZE);
  return {
    data,
    page,
    pageSize: PAGE_SIZE,
    total: feedPosts.length,
    hasMore: start + PAGE_SIZE < feedPosts.length,
  };
}

export async function likeFeedPost(id: string): Promise<FeedPost> {
  await mockDelay(150);
  const index = feedPosts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Post not found');
  feedPosts[index] = {
    ...feedPosts[index],
    liked: !feedPosts[index].liked,
    likes: feedPosts[index].liked ? feedPosts[index].likes - 1 : feedPosts[index].likes + 1,
  };
  return feedPosts[index];
}
