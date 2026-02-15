# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Expo 프로덕션 스타터킷. iOS, Android, Web 크로스플랫폼 지원.
Expo SDK 54, React 19, React Native 0.81, TypeScript 5.9 (strict) 기반.

## Commands

```bash
npx expo start          # 개발 서버 실행
npx expo start --ios    # iOS 시뮬레이터
npx expo start --android # Android 에뮬레이터
npx expo start --web    # 웹 브라우저
npx expo lint           # ESLint 실행
npx tsc --noEmit        # TypeScript 타입 체크
```

### E2E Testing (Maestro)
- **Maestro MCP** 서버가 글로벌 설치됨 (`~/.maestro-mcp/`)
- 플로우 위치: `maestro/flows/` (YAML)
- TestID 레지스트리: `lib/utils/testIds.ts` — 새 UI 요소에 반드시 testID 추가
- testID 네이밍: `<screen>-<element>-<type>` (lowercase-kebab-case)
- 테스트 전 반드시: `maestro_boot_simulator` → `maestro_metro_status` → `maestro_detect_app_id`
- Test-Fix 루프: 최대 5회 반복, 3회차부터 전체 컴포넌트 트리 재확인
- 테스트 실패 시 소스코드를 수정 (테스트 수정은 테스트 버그인 경우만)

## Architecture

### Routing
- **Expo Router v6** 파일 시스템 라우팅 (`app/` 디렉토리)
- `app/(auth)/` — 인증 (이메일 로그인, 회원가입)
- `app/(tabs)/` — 하단 탭 (홈, 채팅, 할 일, 프로필)
- `app/(tabs)/chat/` — 채팅 (목록 + [roomId] 상세)
- `app/(tabs)/todo/` — Todo (목록)
- `app/paywall.tsx` — 구독 페이월 모달
- Root layout의 `unstable_settings = { anchor: '(tabs)' }`로 기본 라우트 설정
- `typedRoutes: true` 활성화 (app.config.ts experiments)

### State Management
- **zustand** — 전역 상태 (auth, subscription, chat, call, todo, upload, player, app)
- **@tanstack/react-query** — 서버 상태 캐싱 (stale: 5min, gc: 30min, retry: 2)
- **react-native-mmkv** — 영속 스토리지 (zustand persist)
- **expo-secure-store** — 토큰 보안 저장 (native), MMKV fallback (web)

### Key Architectural Patterns
- **Token getter injection**: API 클라이언트에 `setTokenGetter()` 콜백 주입 — 순환 의존성 방지
- **ApiResponse<T>**: 모든 API 호출은 `{ data, error, status }` 튜플 반환 (throw 안 함)
- **Platform-aware storage**: SecureStore (iOS/Android) → MMKV (web) → in-memory Map (fallback)
- **Optimistic updates**: 채팅 메시지에 temp ID 기반 낙관적 업데이트

### Theming & Styling
- **NativeWind v4** — Tailwind CSS 클래스 기반 스타일링
- `tailwind.config.js` — 디자인 토큰 (primary/blue, secondary/purple, neutral, semantic colors)
- `global.css` — Tailwind directives

### Cross-Domain Integration
- 구독 활성화 → 광고 OFF, 파일 용량 무제한, 통화 시간 무제한, 오프라인 다운로드
- 통화 시작 → 음악 정지, 광고 차단 / 통화 종료 → 음악 재개
- 채팅방 입장 → 광고 차단 / 퇴장 → 광고 해제
- `lib/cross-domain/integration-manager.ts`에서 관리

## Key Conventions

- **Path alias**: `@/*` → 프로젝트 루트
- **파일 네이밍**: kebab-case (`themed-text.tsx`, `use-theme-color.ts`)
- **스타일링**: NativeWind 클래스 우선, 필요시 StyleSheet.create()
- **New Architecture** 활성화 (`newArchEnabled: true`)
- **React Compiler** 활성화 (`reactCompiler: true`)
- **Strict TypeScript**: strict 모드
- **광고 하드코딩 금지**: `adConditionEngine`을 통해서만 광고 표시
- **영수증 서버 검증**: IAP 영수증은 서버에서만 검증
- **인증**: 이메일 로그인만 지원 (소셜 로그인 미사용)
- **공통 타입**: `ApiResponse<T>`, `AsyncState<T>`, `PaginatedResponse<T>` — `lib/types/common.ts`
- **Barrel exports**: `components/ui/index.ts`, `components/composite/index.ts` 등 공개 API용

## Environment Variables (.env)

```
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## ESLint

flat config 형식 (`eslint.config.js`), `eslint-config-expo` 확장. `dist/*` 무시.
