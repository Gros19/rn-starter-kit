# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Expo 프로덕션 스타터킷. iOS, Android, Web 크로스플랫폼 지원.
Expo SDK 54, React 19, React Native 0.81, TypeScript 5.9 (strict) 기반.
React Native Reusables (shadcn/ui 스타일) UI 컴포넌트 사용.

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
- TestID 레지스트리: `src/lib/utils/testIds.ts` — 새 UI 요소에 반드시 testID 추가
- testID 네이밍: `<screen>-<element>-<type>` (lowercase-kebab-case)
- 테스트 전 반드시: `maestro_boot_simulator` → `maestro_metro_status` → `maestro_detect_app_id`
- Test-Fix 루프: 최대 5회 반복, 3회차부터 전체 컴포넌트 트리 재확인
- 테스트 실패 시 소스코드를 수정 (테스트 수정은 테스트 버그인 경우만)

## Architecture

### Directory Structure
모든 소스코드는 `src/` 하위에 위치:
- `src/app/` — Expo Router 파일 시스템 라우팅
- `src/components/` — UI 컴포넌트 (ui/, common/, layout/, auth/)
- `src/lib/` — 비즈니스 로직 (api/, auth/, stores/, types/, utils/)
- `src/hooks/` — 커스텀 훅
- `src/constants/` — 상수

### Routing
- **Expo Router v6** 파일 시스템 라우팅 (`src/app/` 디렉토리)
- `src/app/(auth)/` — 인증 (login, register, forgot-password)
- `src/app/(tabs)/` — 하단 탭 (홈, 탐색, 설정)
- Root layout의 `unstable_settings = { anchor: '(tabs)' }`로 기본 라우트 설정
- `typedRoutes: true` 활성화 (app.config.ts experiments)

### State Management
- **zustand** — 전역 상태 (auth, app)
- **@tanstack/react-query** — 서버 상태 캐싱 (stale: 5min, gc: 30min, retry: 2)
- **react-native-mmkv** — 영속 스토리지 (zustand persist)
- **expo-secure-store** — 토큰 보안 저장 (native), MMKV fallback (web)

### Key Architectural Patterns
- **Token getter injection**: API 클라이언트에 `setTokenGetter()` 콜백 주입 — 순환 의존성 방지
- **ApiResponse<T>**: 모든 API 호출은 `{ data, error, status }` 튜플 반환 (throw 안 함)
- **Platform-aware storage**: SecureStore (iOS/Android) → MMKV (web) → in-memory Map (fallback)

### UI & Styling
- **React Native Reusables** — shadcn/ui 스타일 컴포넌트 (`src/components/ui/`)
- **NativeWind v4** — Tailwind CSS 클래스 기반 스타일링
- **HSL CSS 변수** — 라이트/다크 테마 (`src/global.css`)
- **cn() 유틸** — `clsx` + `tailwind-merge` (`src/lib/utils/cn.ts`)
- RNR CLI: `npx @react-native-reusables/cli add <component>` 로 새 컴포넌트 추가

## Key Conventions

- **Path alias**: `@/*` → `./src/*`
- **파일 네이밍**: kebab-case (`auth-guard.tsx`, `use-color-scheme.ts`)
- **스타일링**: NativeWind 클래스 우선, RNR 컴포넌트 사용
- **New Architecture** 활성화 (`newArchEnabled: true`)
- **React Compiler** 활성화 (`reactCompiler: true`)
- **Strict TypeScript**: strict 모드
- **인증**: 이메일 로그인만 지원 (소셜 로그인 미사용)
- **공통 타입**: `ApiResponse<T>`, `AsyncState<T>`, `PaginatedResponse<T>` — `src/lib/types/common.ts`

## Environment Variables (.env)

```
EXPO_PUBLIC_API_BASE_URL=
```

## ESLint

flat config 형식 (`eslint.config.js`), `eslint-config-expo` 확장. `dist/*` 무시.
