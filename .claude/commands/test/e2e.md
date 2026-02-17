# Maestro E2E 테스트 실행

$ARGUMENTS: flow 이름 (선택, 미지정시 전체 실행)

## 실행 순서

1. `maestro_boot_simulator`로 시뮬레이터 부팅 확인
2. `maestro_metro_status`로 Metro 번들러 상태 확인
3. `maestro_detect_app_id`로 앱 번들 ID 감지
4. 테스트 실행:
   - `$ARGUMENTS`가 지정된 경우: `maestro/flows/$ARGUMENTS.yaml` 실행
   - 미지정인 경우: `maestro/flows/` 디렉토리의 모든 `.yaml` 플로우 실행
5. 실패 시:
   - `maestro_take_screenshot`로 현재 화면 캡처
   - `maestro_get_hierarchy`로 UI 계층구조 확인
   - 실패 원인 분석 및 소스코드 수정 (테스트 버그가 아닌 한 테스트 수정 금지)
6. Test-Fix 루프 (최대 5회 반복, 3회차부터 전체 컴포넌트 트리 재확인)

## 사전 조건

- iOS 시뮬레이터 사용 가능
- Maestro CLI 설치됨
- 앱이 빌드되어 시뮬레이터에 설치됨

## 주의사항

- 테스트 실패 시 소스코드를 수정한다 (테스트 수정은 테스트 자체의 버그인 경우만)
- testID는 `src/lib/utils/testIds.ts` 레지스트리의 값을 사용한다
- 각 플로우는 독립적으로 실행 가능해야 한다
