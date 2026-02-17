import { StateStorage } from 'zustand/middleware';

/** MMKV 스토리지 - 네이티브 빌드에서만 동작, 개발 시 AsyncStorage 폴백 */
let mmkvInstance: { getString: (k: string) => string | undefined; set: (k: string, v: string) => void; delete: (k: string) => void } | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MMKV } = require('react-native-mmkv');
  mmkvInstance = new MMKV();
} catch {
  console.warn('MMKV not available, using in-memory storage fallback');
}

const memoryStore = new Map<string, string>();

/** Zustand persist용 스토리지 어댑터 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    if (mmkvInstance) {
      return mmkvInstance.getString(name) ?? null;
    }
    return memoryStore.get(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    if (mmkvInstance) {
      mmkvInstance.set(name, value);
    } else {
      memoryStore.set(name, value);
    }
  },
  removeItem: (name: string) => {
    if (mmkvInstance) {
      mmkvInstance.delete(name);
    } else {
      memoryStore.delete(name);
    }
  },
};
