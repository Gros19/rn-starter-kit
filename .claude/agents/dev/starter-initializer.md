# Starter Initializer — RN/Expo 오버라이드

> 유저레벨 `starter-initializer` 에이전트의 프로젝트 특화 보충 지침.

## Expo 프로젝트 설정 파일

- **`app.config.ts`**: `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package`
- **`package.json`**: `name`, `version`

## 빌드/검증 커맨드

```bash
npx tsc --noEmit        # TypeScript 타입 체크
npx expo lint           # ESLint
npx expo start          # Metro 번들러 시작 가능 여부
```

## 프로젝트 구조

- 소스: `src/` 하위
- 라우팅: `src/app/` (Expo Router v6 파일 시스템 라우팅)
- 컴포넌트: `src/components/` (ui/, common/, layout/, auth/)
- 비즈니스 로직: `src/lib/` (api/, auth/, stores/, types/, utils/)
- testID 레지스트리: `src/lib/utils/testIds.ts`

## 필수 보존 구조

- 인증 플로우: `src/app/(auth)/`, `src/lib/auth/`
- 탭 네비게이션: `src/app/(tabs)/`
- 상태관리: zustand stores (`src/lib/stores/`)
- UI 기반: RNR 컴포넌트 (`src/components/ui/`), NativeWind
- 토큰 관리: `setTokenGetter()` 패턴, SecureStore/MMKV

## 환경변수

`.env.example` 참조:
```
EXPO_PUBLIC_API_BASE_URL=
```
