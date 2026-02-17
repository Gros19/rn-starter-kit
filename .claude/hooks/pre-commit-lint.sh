#!/bin/bash
# Claude Code PreToolUse Hook: git commit 전 ESLint 실행
# stdin으로 전달되는 JSON에서 command 필드를 읽어 git commit인지 확인

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | sed 's/"command":"//;s/"$//')

if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

echo "Running ESLint on staged files..."
npx expo lint

if [ $? -ne 0 ]; then
  echo "ESLint failed. Please fix lint errors before committing."
  exit 2
fi

exit 0
