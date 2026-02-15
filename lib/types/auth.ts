export type AuthProvider = 'email';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  authProvider: AuthProvider;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
