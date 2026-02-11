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

테스트 프레임워크는 아직 설정되지 않음.

## Architecture

### Routing
- **Expo Router v6** 파일 시스템 라우팅 (`app/` 디렉토리)
- `app/(auth)/` — 인증 (로그인, 회원가입)
- `app/(tabs)/` — 하단 탭 (홈, 채팅, 할 일, 프로필)
- `app/(tabs)/chat/` — 채팅 (목록 + [roomId] 상세)
- `app/(tabs)/todo/` — Todo (목록)
- `app/paywall.tsx` — 구독 페이월 모달
- `app.json`에서 `typedRoutes: true` 활성화

### State Management
- **zustand** — 전역 상태 (auth, subscription, chat, call, todo, upload, player)
- **@tanstack/react-query** — 서버 상태 캐싱
- **react-native-mmkv** — 영속 스토리지 (zustand persist)
- **expo-secure-store** — 토큰 보안 저장

### Theming & Styling
- **NativeWind v4** — Tailwind CSS 클래스 기반 스타일링
- `tailwind.config.js` — 디자인 토큰 (primary, secondary, neutral, semantic colors)
- `constants/theme.ts` — light/dark 컬러 팔레트 및 폰트 정의
- `global.css` — Tailwind directives

### Domain Structure
```
lib/
├── api/          # API 클라이언트, React Query 설정
├── auth/         # SSO (Apple/Google/Kakao), 토큰 관리
├── ads/          # AdMob 조건부 활성화 엔진
├── chat/         # Supabase Realtime 채팅
├── call/         # (LiveKit) 음성 통화
├── notification/ # Push + Local 알림
├── subscription/ # IAP 구독 결제
├── upload/       # 파일 업로드 (카메라/갤러리/문서)
├── cross-domain/ # 크로스 도메인 연동 매니저
├── stores/       # Zustand 스토어 (도메인별)
├── types/        # TypeScript 타입 정의
├── hooks/        # 커스텀 훅
├── utils/        # 유틸리티 (MMKV 등)
└── providers.tsx # 앱 프로바이더 (QueryClient, ErrorBoundary)

components/
├── layout/       # SafeArea, Container, Row, Spacer, KeyboardAwareView
├── ui/           # Button, Input, Badge, Avatar, Card, Chip, Switch, Checkbox, Radio, Skeleton, Progress
├── composite/    # Header, ListItem, SearchBar, EmptyState, ActionSheet
├── feedback/     # ErrorBoundary, LoadingOverlay
├── auth/         # SocialLoginButton, AuthGuard
├── subscription/ # Paywall, FeatureGate
├── ads/          # ConditionalAdBanner
├── chat/         # MessageBubble, ChatInput
├── call/         # CallScreen
├── todo/         # TodoCard
├── player/       # MiniPlayer
└── upload/       # (file picker UI)
```

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
- **네이티브 SDK SSO**: WebView 방식 금지

## Environment Variables (.env)

```
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## ESLint

flat config 형식 (`eslint.config.js`), `eslint-config-expo` 확장. `dist/*` 무시.
