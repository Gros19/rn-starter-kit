import { Modal, View, Pressable, Image, useWindowDimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import type { MediaItem } from '../types';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ImageViewerProps {
  item: MediaItem | null;
  visible: boolean;
  onClose: () => void;
}

export function ImageViewer({ item, visible, onClose }: ImageViewerProps) {
  const { width, height } = useWindowDimensions();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else if (scale.value > 4) {
        scale.value = withTiming(4);
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-14 pb-4">
          <Text className="text-white text-base font-medium">{item.title}</Text>
          <Pressable onPress={onClose} className="w-10 h-10 items-center justify-center">
            <X size={24} color="white" />
          </Pressable>
        </View>

        {/* Image */}
        <GestureDetector gesture={composed}>
          <Animated.View
            className="flex-1 items-center justify-center"
            style={animatedStyle}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width, height: height * 0.7 }}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
