import { FlatList, View, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { RelativeTime } from '@/components/common/relative-time';
import { useChatStore } from '@/features/chat/store';

export default function ChatRoomsScreen() {
  const router = useRouter();
  const rooms = useChatStore((s) => s.rooms);

  return (
    <>
      <Stack.Screen options={{ title: '채팅' }} />
      <SafeArea edges={['top']}>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pb-4"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(features)/chat/${item.id}` as never)}
              className="flex-row items-center px-4 py-3 active:bg-muted/50"
            >
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Text className="text-xl">{item.avatar}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                  {item.lastMessageAt && (
                    <RelativeTime date={item.lastMessageAt} />
                  )}
                </View>
                {item.lastMessage && (
                  <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                )}
              </View>
              {item.unreadCount > 0 && (
                <View className="ml-2 w-5 h-5 rounded-full bg-primary items-center justify-center">
                  <Text className="text-[10px] text-primary-foreground font-bold">
                    {item.unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View className="h-px bg-border mx-4" />}
        />
      </SafeArea>
    </>
  );
}
