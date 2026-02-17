#!/bin/bash
# Claude Code PreToolUse Hook: git push 전 TypeScript 타입 체크
# stdin으로 전달되는 JSON에서 command 필드를 읽어 git push인지 확인

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | sed 's/"command":"//;s/"$//')

if ! echo "$COMMAND" | grep -q "git push"; then
  exit 0
fi

echo "Running TypeScript type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
  echo "TypeScript type check failed. Please fix type errors before pushing."
  exit 2
fi

exit 0
