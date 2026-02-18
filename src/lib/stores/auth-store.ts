import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/lib/types/auth';
import { tokenService } from '@/lib/auth/token-service';
import { authApi } from '@/lib/auth/auth-api';
import { setTokenGetter, setTokenRefresher, setSignOutHandler } from '@/lib/api/client';
import { mmkvStorage } from '@/lib/utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  /** 앱 시작 시 토큰 확인 후 사용자 정보 복원 */
  initialize: () => Promise<void>;

  /** 이메일 로그인 */
  signInWithEmail: (email: string, password: string) => Promise<void>;

  /** 이메일 회원가입 */
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;

  /** 로그아웃 */
  signOut: () => Promise<void>;

  /** 회원 탈퇴 */
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // API 클라이언트에 토큰 getter 주입
      setTokenGetter(() => {
        return null; // 실제 토큰은 SecureStore에서 관리
      });

      // 토큰 갱신 함수 주입
      setTokenRefresher(async () => {
        try {
          const refreshToken = await tokenService.getRefreshToken();
          if (!refreshToken) return false;

          const { data, error } = await authApi.refreshToken(refreshToken);
          if (error || !data) return false;

          await tokenService.setTokens(data.accessToken, data.refreshToken);
          setTokenGetter(() => data.accessToken);
          return true;
        } catch {
          return false;
        }
      });

      // 로그아웃 핸들러 주입
      setSignOutHandler(async () => {
        await tokenService.clearTokens();
        setTokenGetter(() => null);
        set({ user: null, isAuthenticated: false });
      });

      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,

        initialize: async () => {
          // Dev mode: 로그인 스킵
          if (__DEV__) {
            set({
              user: {
                id: 'dev-user',
                email: 'dev@example.com',
                name: 'Dev User',
                authProvider: 'email',
                createdAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              isInitialized: true,
            });
            return;
          }

          try {
            const token = await tokenService.getAccessToken();
            if (!token) {
              set({ isInitialized: true });
              return;
            }

            // API 클라이언트에 토큰 주입
            setTokenGetter(() => token);

            const { data, error } = await authApi.getProfile();
            if (error || !data) {
              await tokenService.clearTokens();
              setTokenGetter(() => null);
              set({ isInitialized: true, isAuthenticated: false, user: null });
              return;
            }

            set({ user: data, isAuthenticated: true, isInitialized: true });
          } catch {
            set({ isInitialized: true });
          }
        },

        signInWithEmail: async (email, password) => {
          set({ isLoading: true });
          try {
            const { data, error } = await authApi.signIn({ email, password });
            if (error || !data) throw new Error(error ?? '로그인 실패');

            await tokenService.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
            setTokenGetter(() => data.tokens.accessToken);
            set({ user: data.user, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        signUpWithEmail: async (email, password, name) => {
          set({ isLoading: true });
          try {
            const { data, error } = await authApi.signUp({ email, password, name });
            if (error || !data) throw new Error(error ?? '회원가입 실패');

            await tokenService.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
            setTokenGetter(() => data.tokens.accessToken);
            set({ user: data.user, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        signOut: async () => {
          try {
            await authApi.signOut();
          } catch {
            // 서버 에러 무시
          }
          await tokenService.clearTokens();
          setTokenGetter(() => null);
          set({ user: null, isAuthenticated: false });
        },

        deleteAccount: async () => {
          set({ isLoading: true });
          try {
            const { error } = await authApi.deleteAccount();
            if (error) throw new Error(error);

            await tokenService.clearTokens();
            setTokenGetter(() => null);
            set({ user: null, isAuthenticated: false });
          } finally {
            set({ isLoading: false });
          }
        },
      };
    },
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
