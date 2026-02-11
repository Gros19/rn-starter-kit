import { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react-native';
import { Avatar } from '@/components/ui';
import { useCallStore } from '@/lib/stores/call-store';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CallScreen() {
  const { session, isMuted, isSpeakerOn, duration, endCall, toggleMute, toggleSpeaker, tick } =
    useCallStore();
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (session?.state === 'connected') {
      timerRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.state, tick]);

  if (!session) return null;

  return (
    <View className="flex-1 bg-neutral-950 items-center justify-center px-8">
      <Avatar name={session.callerName} uri={session.callerAvatar} size="xl" />
      <Text className="text-white text-2xl font-bold mt-6">{session.callerName}</Text>
      <Text className="text-neutral-400 text-base mt-1">
        {session.state === 'connected'
          ? formatDuration(duration)
          : session.state === 'ringing'
            ? '벨이 울리는 중...'
            : '연결 중...'}
      </Text>

      <View className="flex-row gap-6 mt-16">
        <Pressable
          onPress={toggleMute}
          className={`w-16 h-16 rounded-full items-center justify-center ${isMuted ? 'bg-white' : 'bg-white/20'}`}
          accessibilityLabel={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? <MicOff size={28} color="#000" /> : <Mic size={28} color="#fff" />}
        </Pressable>

        <Pressable
          onPress={toggleSpeaker}
          className={`w-16 h-16 rounded-full items-center justify-center ${isSpeakerOn ? 'bg-white' : 'bg-white/20'}`}
          accessibilityLabel="스피커"
        >
          <Volume2 size={28} color={isSpeakerOn ? '#000' : '#fff'} />
        </Pressable>

        <Pressable
          onPress={endCall}
          className="w-16 h-16 rounded-full bg-error-500 items-center justify-center"
          accessibilityLabel="통화 종료"
        >
          <PhoneOff size={28} color="#fff" />
        </Pressable>
      </View>

      {session.state === 'ringing' && (
        <View className="flex-row gap-6 mt-8">
          <Pressable
            onPress={endCall}
            className="w-16 h-16 rounded-full bg-error-500 items-center justify-center"
            accessibilityLabel="거절"
          >
            <PhoneOff size={28} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => useCallStore.getState().acceptCall(session.id)}
            className="w-16 h-16 rounded-full bg-success-500 items-center justify-center"
            accessibilityLabel="수락"
          >
            <Phone size={28} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
