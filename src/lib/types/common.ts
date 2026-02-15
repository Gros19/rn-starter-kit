/** 공통 타입 정의 */

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

/** 페이지네이션 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** 비동기 상태 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/** 앱 전역 설정 */
export interface AppConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  admobBannerId: string;
  admobInterstitialId: string;
  admobRewardedId: string;
  livekitUrl: string;
  sentryDsn: string;
}
