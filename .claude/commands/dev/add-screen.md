# 새 스크린 스캐폴딩

$ARGUMENTS: 스크린 이름과 위치 (예: "(tabs)/profile", "(auth)/verify-email")

## 실행 순서

1. `$ARGUMENTS`를 파싱하여 라우트 그룹 및 스크린 경로 결정
2. 기존 라우트 구조 확인: `src/app/` 디렉토리 탐색
3. `src/app/$ARGUMENTS/index.tsx` 스크린 파일 생성:
   - NativeWind 클래스 기반 스타일링
   - RNR 컴포넌트 활용
   - testID 속성 포함
   - default export (Expo Router 요구사항)
4. `src/lib/utils/testIds.ts`에 새 스크린 testID 등록:
   - 네이밍 규칙: `<screen>-<element>-<type>` (lowercase-kebab-case)
5. 필요시 해당 라우트 그룹의 `_layout.tsx` 업데이트
6. `npx tsc --noEmit`으로 타입 체크 실행
7. 생성된 파일 경로와 라우트 정보 출력

## 스크린 템플릿

```typescript
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TestIds } from '@/lib/utils/testIds';

export default function ScreenNameScreen() {
  return (
    <View className="flex-1 p-4" testID={TestIds.screenName.screen}>
      <Text className="text-2xl font-bold">Screen Title</Text>
    </View>
  );
}
```

## 주의사항

- 파일 네이밍은 kebab-case
- `@/*` path alias 사용
- 기존 layout.tsx 구조와 일관성 유지
