import { View, Pressable } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ProgressBar } from '@/components/common/progress-bar';
import { RefreshCw, X, CheckCircle, AlertCircle, FileIcon } from 'lucide-react-native';
import type { UploadItem as UploadItemType } from '../types';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadItemProps {
  item: UploadItemType;
  onRetry: () => void;
  onRemove: () => void;
}

export function UploadItemCard({ item, onRetry, onRemove }: UploadItemProps) {
  return (
    <Card>
      <CardContent className="pt-0">
        <View className="flex-row items-center gap-3">
          <View className="bg-muted w-10 h-10 rounded-lg items-center justify-center">
            {item.status === 'success' ? (
              <CheckCircle size={20} className="text-primary" />
            ) : item.status === 'error' ? (
              <AlertCircle size={20} className="text-destructive" />
            ) : (
              <FileIcon size={20} className="text-muted-foreground" />
            )}
          </View>

          <View className="flex-1 gap-1">
            <Text className="font-medium" numberOfLines={1}>{item.name}</Text>
            <Text variant="muted">{formatSize(item.size)}</Text>
            {(item.status === 'uploading' || item.status === 'pending') && (
              <ProgressBar progress={item.progress} />
            )}
            {item.status === 'error' && (
              <Text className="text-destructive text-xs">업로드 실패 (시도 {item.retryCount}회)</Text>
            )}
          </View>

          <View className="flex-row gap-1">
            {item.status === 'error' && (
              <Pressable onPress={onRetry} className="p-2" hitSlop={8}>
                <RefreshCw size={18} className="text-muted-foreground" />
              </Pressable>
            )}
            <Pressable onPress={onRemove} className="p-2" hitSlop={8}>
              <X size={18} className="text-muted-foreground" />
            </Pressable>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
