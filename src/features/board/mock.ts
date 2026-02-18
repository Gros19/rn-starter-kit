import type {
  Post,
  Comment,
  BoardFilter,
  CreatePostPayload,
  UpdatePostPayload,
  CreateCommentPayload,
} from './types';
import { mockDelay } from '@/lib/mock/delay';

let posts: Post[] = [
  { id: '1', title: 'React Native 시작 가이드', content: 'Expo SDK 54와 함께 React Native를 시작하는 방법을 공유합니다. 새로운 아키텍처와 React 19의 장점을 최대한 활용할 수 있습니다.\n\n1. Expo CLI 설치\n2. 프로젝트 생성\n3. 개발 서버 실행\n\n자세한 내용은 공식 문서를 참고하세요.', category: 'tips', author: { id: 'u1', name: '김개발' }, likes: 12, liked: false, commentCount: 3, createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-02-15T09:00:00Z' },
  { id: '2', title: 'NativeWind v4 다크 모드 구현', content: 'NativeWind v4에서 다크 모드를 구현하는 방법입니다. CSS 변수 기반으로 테마를 관리하면 매우 깔끔합니다.\n\n`global.css`에서 HSL 변수를 정의하고, `bg-background`, `text-foreground` 같은 시맨틱 클래스를 사용합니다.', category: 'tips', author: { id: 'u2', name: '이디자인' }, likes: 8, liked: true, commentCount: 2, createdAt: '2026-02-14T14:00:00Z', updatedAt: '2026-02-14T14:00:00Z' },
  { id: '3', title: 'Zustand vs Redux Toolkit 비교', content: 'React Native 프로젝트에서 상태관리 라이브러리를 선택할 때 고려할 점들을 정리했습니다.\n\nZustand 장점:\n- 보일러플레이트 최소화\n- TypeScript 지원 우수\n- 번들 크기 작음\n\nRedux Toolkit 장점:\n- 대규모 팀에 적합\n- DevTools 지원\n- 미들웨어 생태계', category: 'question', author: { id: 'u3', name: '박아키텍트' }, likes: 15, liked: false, commentCount: 5, createdAt: '2026-02-13T16:00:00Z', updatedAt: '2026-02-14T10:00:00Z' },
  { id: '4', title: '스타터킷 소개', content: '이 스타터킷은 프로덕션 레벨의 React Native 앱을 빠르게 시작할 수 있도록 설계되었습니다.\n\n포함된 기능:\n- 인증 (이메일)\n- CRUD (할 일)\n- 파일 업로드\n- 알림\n- 구독 관리', category: 'showcase', author: { id: 'u1', name: '김개발' }, likes: 20, liked: true, commentCount: 4, createdAt: '2026-02-12T09:00:00Z', updatedAt: '2026-02-12T09:00:00Z' },
  { id: '5', title: 'React Query 캐싱 전략', content: 'staleTime과 gcTime을 적절히 설정하는 방법에 대해 질문합니다.\n\n현재 설정:\n- staleTime: 5분\n- gcTime: 30분\n\n이 설정이 적절한지, 더 나은 전략이 있는지 궁금합니다.', category: 'question', author: { id: 'u4', name: '최프론트' }, likes: 6, liked: false, commentCount: 3, createdAt: '2026-02-11T11:00:00Z', updatedAt: '2026-02-11T15:00:00Z' },
  { id: '6', title: '첫 앱 출시 후기', content: '스타터킷을 기반으로 첫 앱을 출시했습니다! App Store와 Google Play 모두 등록 완료.\n\n개발 기간: 3주\n사용 기술: Expo, React Query, Zustand\n\n가장 도움이 되었던 부분은 인증 플로우와 파일 업로드 패턴이었습니다.', category: 'showcase', author: { id: 'u5', name: '정모바일' }, likes: 25, liked: false, commentCount: 7, createdAt: '2026-02-10T13:00:00Z', updatedAt: '2026-02-10T13:00:00Z' },
  { id: '7', title: 'Expo Router v6 중첩 라우팅', content: '그룹 라우팅을 활용한 중첩 네비게이션 구조를 공유합니다.\n\n(auth), (tabs), (features) 그룹을 분리하면 코드 구조가 깔끔해집니다.', category: 'tips', author: { id: 'u2', name: '이디자인' }, likes: 10, liked: false, commentCount: 1, createdAt: '2026-02-09T10:00:00Z', updatedAt: '2026-02-09T10:00:00Z' },
  { id: '8', title: 'TypeScript strict 모드 필수인가요?', content: 'strict 모드를 켜면 초기 개발 속도가 느려지는 느낌입니다. 스타터킷에서는 strict를 권장하는데, 실제로 얼마나 도움이 되나요?', category: 'question', author: { id: 'u6', name: '한타입' }, likes: 4, liked: false, commentCount: 6, createdAt: '2026-02-08T16:00:00Z', updatedAt: '2026-02-09T09:00:00Z' },
];

let comments: Comment[] = [
  { id: 'c1', postId: '1', content: '좋은 가이드 감사합니다! Expo Go로 바로 시작할 수 있어서 편하네요.', author: { id: 'u3', name: '박아키텍트' }, likes: 3, liked: false, createdAt: '2026-02-15T10:00:00Z' },
  { id: 'c2', postId: '1', content: 'New Architecture 활성화 관련 팁도 있나요?', author: { id: 'u4', name: '최프론트' }, likes: 1, liked: false, createdAt: '2026-02-15T11:00:00Z' },
  { id: 'c3', postId: '1', content: '네, app.config.ts에서 newArchEnabled: true로 설정하면 됩니다.', author: { id: 'u1', name: '김개발' }, likes: 2, liked: false, createdAt: '2026-02-15T12:00:00Z' },
  { id: 'c4', postId: '2', content: 'HSL 변수 방식 정말 깔끔하네요!', author: { id: 'u1', name: '김개발' }, likes: 1, liked: false, createdAt: '2026-02-14T15:00:00Z' },
  { id: 'c5', postId: '2', content: 'cn() 유틸리티 함수가 핵심이죠.', author: { id: 'u5', name: '정모바일' }, likes: 0, liked: false, createdAt: '2026-02-14T16:00:00Z' },
  { id: 'c6', postId: '3', content: '소규모 프로젝트에서는 Zustand가 확실히 편합니다.', author: { id: 'u1', name: '김개발' }, likes: 5, liked: false, createdAt: '2026-02-13T17:00:00Z' },
  { id: 'c7', postId: '4', content: '완성도가 높네요! 바로 사용하겠습니다.', author: { id: 'u3', name: '박아키텍트' }, likes: 3, liked: false, createdAt: '2026-02-12T10:00:00Z' },
];

let nextPostId = 9;
let nextCommentId = 8;

// Posts

function filterPosts(filter?: BoardFilter): Post[] {
  let result = [...posts];
  if (filter?.category) {
    result = result.filter((p) => p.category === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getPosts(filter?: BoardFilter): Promise<Post[]> {
  await mockDelay(400);
  return filterPosts(filter);
}

export async function getPost(id: string): Promise<Post | null> {
  await mockDelay(200);
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  await mockDelay(300);
  const now = new Date().toISOString();
  const post: Post = {
    id: String(nextPostId++),
    title: payload.title,
    content: payload.content,
    category: payload.category,
    author: { id: 'u0', name: '나' },
    likes: 0,
    liked: false,
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  posts.unshift(post);
  return post;
}

export async function updatePost(id: string, payload: UpdatePostPayload): Promise<Post> {
  await mockDelay(300);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Post not found');
  posts[index] = {
    ...posts[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return posts[index];
}

export async function deletePost(id: string): Promise<void> {
  await mockDelay(200);
  posts = posts.filter((p) => p.id !== id);
  comments = comments.filter((c) => c.postId !== id);
}

export async function likePost(id: string): Promise<Post> {
  await mockDelay(150);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Post not found');
  posts[index] = {
    ...posts[index],
    liked: !posts[index].liked,
    likes: posts[index].liked ? posts[index].likes - 1 : posts[index].likes + 1,
  };
  return posts[index];
}

// Comments

export async function getComments(postId: string): Promise<Comment[]> {
  await mockDelay(300);
  return comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  await mockDelay(300);
  const comment: Comment = {
    id: `c${nextCommentId++}`,
    postId: payload.postId,
    content: payload.content,
    author: { id: 'u0', name: '나' },
    likes: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  // 댓글 수 업데이트
  const postIndex = posts.findIndex((p) => p.id === payload.postId);
  if (postIndex !== -1) {
    posts[postIndex] = { ...posts[postIndex], commentCount: posts[postIndex].commentCount + 1 };
  }
  return comment;
}

export async function likeComment(id: string): Promise<Comment> {
  await mockDelay(150);
  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Comment not found');
  comments[index] = {
    ...comments[index],
    liked: !comments[index].liked,
    likes: comments[index].liked ? comments[index].likes - 1 : comments[index].likes + 1,
  };
  return comments[index];
}
