# Maestro Flow Writer — RN/Expo Go 오버라이드

> 유저레벨 `maestro-flow-writer` 에이전트의 프로젝트 특화 보충 지침.

## Expo Go 환경 대응

### appId 설정
- Expo Go 환경: `appId: host.exp.Exponent`
- 개발 빌드: `maestro_detect_app_id`로 감지

### 프로젝트 선택 단계
Expo Go에서는 `launchApp` 후 프로젝트 선택 필요:
```yaml
- tapOn:
    text: "rn-starter-kit"
    index: 0
    optional: true
```

### 텍스트 인식 주의사항
- React Native에서 Maestro의 `text` 필드가 비어있고 `accessibilityText`에만 값이 있는 경우 빈번
- `accessibilityLabel`이 설정된 경우 텍스트보다 우선 매칭됨

## 프로젝트 설정

- **플로우 디렉토리**: `maestro/flows/`
- **testID 레지스트리**: `src/lib/utils/testIds.ts`
- **번들러 상태 확인**: `maestro_metro_status` (Metro)

## 공통 서브플로우

- `maestro/flows/shared/preflight.yaml` — Expo Go 앱 진입 (프로젝트 선택 + 온보딩 스킵)
- `maestro/flows/shared/recover.yaml` — 앱 종료 → 재시작 → 프로젝트 재진입

새 플로우 작성 시 반드시 `runFlow: file: shared/preflight.yaml` 사용 권장.
