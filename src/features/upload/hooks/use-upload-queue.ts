import { create } from 'zustand';
import type { UploadItem, UploadStatus } from '../types';
import { mockUpload } from '../mock';
import * as Crypto from 'expo-crypto';

interface UploadQueueState {
  items: UploadItem[];
  isProcessing: boolean;
  addItem: (uri: string, name: string, size: number, mimeType: string) => void;
  removeItem: (id: string) => void;
  retryItem: (id: string) => void;
  clearCompleted: () => void;
  processQueue: () => Promise<void>;
}

function updateItem(
  items: UploadItem[],
  id: string,
  updates: Partial<UploadItem>,
): UploadItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export const useUploadQueue = create<UploadQueueState>()((set, get) => ({
  items: [],
  isProcessing: false,

  addItem: (uri, name, size, mimeType) => {
    const id = Crypto.randomUUID();
    const newItem: UploadItem = {
      id,
      uri,
      name,
      size,
      mimeType,
      status: 'pending',
      progress: 0,
      retryCount: 0,
    };
    set((state) => ({ items: [newItem, ...state.items] }));
    // 큐 자동 처리
    if (!get().isProcessing) {
      get().processQueue();
    }
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  retryItem: (id) => {
    set((state) => ({
      items: updateItem(state.items, id, {
        status: 'pending' as UploadStatus,
        progress: 0,
      }),
    }));
    if (!get().isProcessing) {
      get().processQueue();
    }
  },

  clearCompleted: () => {
    set((state) => ({
      items: state.items.filter((item) => item.status !== 'success'),
    }));
  },

  processQueue: async () => {
    set({ isProcessing: true });

    while (true) {
      const { items } = get();
      const pending = items.find((item) => item.status === 'pending');
      if (!pending) break;

      set((state) => ({
        items: updateItem(state.items, pending.id, { status: 'uploading' as UploadStatus }),
      }));

      const success = await mockUpload(pending, (progress) => {
        set((state) => ({
          items: updateItem(state.items, pending.id, { progress }),
        }));
      });

      set((state) => ({
        items: updateItem(state.items, pending.id, {
          status: success ? ('success' as UploadStatus) : ('error' as UploadStatus),
          progress: success ? 100 : state.items.find((i) => i.id === pending.id)?.progress ?? 0,
          retryCount: success
            ? pending.retryCount
            : pending.retryCount + 1,
        }),
      }));
    }

    set({ isProcessing: false });
  },
}));
