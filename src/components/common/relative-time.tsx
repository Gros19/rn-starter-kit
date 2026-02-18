import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 5) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return (
    <Text className={cn('text-xs text-muted-foreground', className)}>
      {getRelativeTimeString(d)}
    </Text>
  );
}
