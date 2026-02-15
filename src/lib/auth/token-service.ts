import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { mmkvStorage } from '@/lib/utils/storage';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/** 네이티브: SecureStore, 웹: MMKV/메모리 폴백 */
async function setSecure(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    mmkvStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecure(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return mmkvStorage.getItem(key) as string | null;
  }
  return SecureStore.getItemAsync(key);
}

async function deleteSecure(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    mmkvStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const tokenService = {
  async setTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      setSecure(ACCESS_TOKEN_KEY, accessToken),
      setSecure(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return getSecure(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecure(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await Promise.all([
      deleteSecure(ACCESS_TOKEN_KEY),
      deleteSecure(REFRESH_TOKEN_KEY),
    ]);
  },
};
