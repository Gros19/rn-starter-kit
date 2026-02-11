import { create } from 'zustand';
import type { UploadItem, UploadSource } from '@/lib/types/upload';
import { api } from '@/lib/api/client';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';
import { FREE_TIER_LIMITS } from '@/lib/types/subscription';

const MAX_RETRIES = 3;

interface UploadState {
  queue: UploadItem[];
  isProcessing: boolean;

  /** 파일 추가 */
  addToQueue: (item: Omit<UploadItem, 'id' | 'status' | 'progress' | 'retryCount'>) => void;

  /** 업로드 큐 처리 */
  processQueue: () => Promise<void>;

  /** 특정 파일 재시도 */
  retry: (id: string) => void;

  /** 큐에서 제거 */
  remove: (id: string) => void;

  /** 파일 크기 제한 확인 */
  checkFileSize: (sizeBytes: number) => boolean;
}

export const useUploadStore = create<UploadState>()((set, get) => ({
  queue: [],
  isProcessing: false,

  addToQueue: (item) => {
    const uploadItem: UploadItem = {
      ...item,
      id: `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      status: 'queued',
      progress: 0,
      retryCount: 0,
    };
    set((s) => ({ queue: [...s.queue, uploadItem] }));

    // 자동 처리 시작
    if (!get().isProcessing) {
      get().processQueue();
    }
  },

  processQueue: async () => {
    set({ isProcessing: true });

    while (true) {
      const { queue } = get();
      const next = queue.find((i) => i.status === 'queued');
      if (!next) break;

      // 상태 업데이트: uploading
      set((s) => ({
        queue: s.queue.map((i) =>
          i.id === next.id ? { ...i, status: 'uploading' as const } : i,
        ),
      }));

      try {
        const { data, error } = await api.post<{ url: string }>('/upload', {
          fileName: next.fileName,
          mimeType: next.mimeType,
          uri: next.uri,
        });

        if (error || !data) throw new Error(error ?? '업로드 실패');

        set((s) => ({
          queue: s.queue.map((i) =>
            i.id === next.id
              ? { ...i, status: 'completed' as const, progress: 100, remoteUrl: data.url }
              : i,
          ),
        }));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        set((s) => ({
          queue: s.queue.map((i) =>
            i.id === next.id
              ? {
                  ...i,
                  status: (i.retryCount < MAX_RETRIES ? 'queued' : 'failed') as UploadItem['status'],
                  retryCount: i.retryCount + 1,
                  error: errorMsg,
                }
              : i,
          ),
        }));
      }
    }

    set({ isProcessing: false });
  },

  retry: (id) => {
    set((s) => ({
      queue: s.queue.map((i) =>
        i.id === id ? { ...i, status: 'queued' as const, error: undefined } : i,
      ),
    }));
    if (!get().isProcessing) get().processQueue();
  },

  remove: (id) => {
    set((s) => ({ queue: s.queue.filter((i) => i.id !== id) }));
  },

  checkFileSize: (sizeBytes) => {
    const isPremium = useSubscriptionStore.getState().isPremium();
    if (isPremium) return true;
    return sizeBytes <= FREE_TIER_LIMITS.maxFileSize;
  },
}));
