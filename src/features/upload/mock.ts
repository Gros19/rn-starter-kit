import type { UploadItem } from './types';
import { mockDelay } from '@/lib/mock/delay';

/** 업로드 시뮬레이션 — progress 0→100, 30% 확률 실패 */
export async function mockUpload(
  item: UploadItem,
  onProgress: (progress: number) => void,
): Promise<boolean> {
  const steps = 10;
  const shouldFail = Math.random() < 0.3;
  const failAt = shouldFail ? Math.floor(Math.random() * 7) + 3 : -1;

  for (let i = 1; i <= steps; i++) {
    await mockDelay(200 + Math.random() * 300);
    if (i === failAt) {
      return false;
    }
    onProgress(Math.round((i / steps) * 100));
  }
  return true;
}
