import { api } from '@/lib/api/client';
import type {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  SocialAuthPayload,
  User,
} from '@/lib/types/auth';

export const authApi = {
  signUp(payload: SignUpPayload) {
    return api.post<AuthResponse>('/auth/sign-up', payload);
  },

  signIn(payload: SignInPayload) {
    return api.post<AuthResponse>('/auth/sign-in', payload);
  },

  socialSignIn(payload: SocialAuthPayload) {
    return api.post<AuthResponse>('/auth/social', payload);
  },

  refreshToken(refreshToken: string) {
    return api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
  },

  getProfile() {
    return api.get<User>('/auth/me');
  },

  deleteAccount() {
    return api.delete<void>('/auth/account');
  },

  signOut() {
    return api.post<void>('/auth/sign-out');
  },
};
