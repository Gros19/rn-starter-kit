import { ApiResponse } from '@/lib/types/common';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  signal?: AbortSignal;
}

/** 토큰 가져오기 함수 (auth store에서 주입) */
let getAccessToken: (() => string | null) | null = null;

export function setTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

/** 토큰 갱신 함수 (auth store에서 주입) */
let refreshTokenFn: (() => Promise<boolean>) | null = null;

export function setTokenRefresher(refresher: () => Promise<boolean>) {
  refreshTokenFn = refresher;
}

/** 로그아웃 함수 (auth store에서 주입) */
let signOutFn: (() => Promise<void>) | null = null;

export function setSignOutHandler(handler: () => Promise<void>) {
  signOutFn = handler;
}

let isRefreshing = false;

async function request<T>(
  method: RequestMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions & { _isRetry?: boolean },
): Promise<ApiResponse<T>> {
  const url = new URL(path, API_BASE_URL);
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const token = getAccessToken?.();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    const data = await response.json();

    // 401 인터셉터: 토큰 갱신 시도 후 재요청
    if (response.status === 401 && !options?._isRetry && !path.includes('/auth/refresh')) {
      if (!isRefreshing && refreshTokenFn) {
        isRefreshing = true;
        const refreshed = await refreshTokenFn();
        isRefreshing = false;

        if (refreshed) {
          return request<T>(method, path, body, { ...options, _isRetry: true });
        }
      }
      // refresh 실패 시 로그아웃
      await signOutFn?.();
      return { data: data as T, error: 'Session expired', status: 401 };
    }

    if (!response.ok) {
      return {
        data: data as T,
        error: data?.message ?? `Request failed: ${response.status}`,
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null as T, error: 'Request cancelled', status: 0 };
    }
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    };
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
