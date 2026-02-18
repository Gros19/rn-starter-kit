import type { MediaItem } from './types';
import { mockDelay } from '@/lib/mock/delay';

// picsum.photos 기반 정적 이미지 데이터
const items: MediaItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `img-${i + 1}`,
  uri: `https://picsum.photos/seed/${i + 1}/400/400`,
  width: 400,
  height: 400,
  title: `Photo ${i + 1}`,
  createdAt: new Date(2026, 1, 17 - Math.floor(i / 4), 10 + i).toISOString(),
}));

export async function getGalleryItems(): Promise<MediaItem[]> {
  await mockDelay(500);
  return items;
}

export async function getGalleryItem(id: string): Promise<MediaItem | null> {
  await mockDelay(200);
  return items.find((item) => item.id === id) ?? null;
}
