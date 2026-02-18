import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withDelay,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={style}
      className="w-2 h-2 rounded-full bg-muted-foreground"
    />
  );
}

export function TypingIndicator() {
  return (
    <View className="self-start mb-2">
      <View className="flex-row items-center gap-1 bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </View>
  );
}
