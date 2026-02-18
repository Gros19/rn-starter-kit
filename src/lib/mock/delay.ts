import type { ApiResponse } from '@/lib/types/common';

export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockApiResponse<T>(
  data: T,
  delay: number = 500,
): Promise<ApiResponse<T>> {
  await mockDelay(delay);
  return { data, error: null, status: 200 };
}

export async function mockApiError<T>(
  error: string,
  status: number = 400,
  delay: number = 300,
): Promise<ApiResponse<T>> {
  await mockDelay(delay);
  return { data: null as T, error, status };
}
