import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, SkipForward, X } from 'lucide-react-native';
import { usePlayerStore } from '@/lib/stores/player-store';

export function MiniPlayer() {
  const {
    currentTrack,
    playbackState,
    isMiniPlayerVisible,
    pause,
    resume,
    next,
    setMiniPlayerVisible,
  } = usePlayerStore();

  if (!isMiniPlayerVisible || !currentTrack) return null;

  const isPlaying = playbackState === 'playing';

  return (
    <View className="flex-row items-center px-4 py-2 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
      {currentTrack.artwork && (
        <Image
          source={{ uri: currentTrack.artwork }}
          style={{ width: 40, height: 40, borderRadius: 8 }}
          contentFit="cover"
        />
      )}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100" numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text className="text-xs text-neutral-500" numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={isPlaying ? pause : resume}
          hitSlop={8}
          accessibilityLabel={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? (
            <Pause size={22} color="#737373" fill="#737373" />
          ) : (
            <Play size={22} color="#737373" fill="#737373" />
          )}
        </Pressable>
        <Pressable onPress={next} hitSlop={8} accessibilityLabel="다음">
          <SkipForward size={22} color="#737373" />
        </Pressable>
        <Pressable
          onPress={() => setMiniPlayerVisible(false)}
          hitSlop={8}
          accessibilityLabel="닫기"
        >
          <X size={18} color="#A3A3A3" />
        </Pressable>
      </View>
    </View>
  );
}
