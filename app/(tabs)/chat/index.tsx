import { useEffect } from 'react';
import { FlatList, View, Text, Pressable } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Avatar, Skeleton } from '@/components/ui';
import { SearchBar } from '@/components/composite';
import { EmptyState } from '@/components/composite';
import { useChatStore } from '@/lib/stores/chat-store';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react-native';

export default function ChatListScreen() {
  const { rooms, loadRooms, isLoading } = useChatStore();
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeArea edges={['top']}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          채팅
        </Text>
        <SearchBar value={search} onChangeText={setSearch} placeholder="채팅방 검색" />
      </View>

      {isLoading && !rooms.length ? (
        <View className="px-4 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <Skeleton width={48} height={48} borderRadius={24} />
              <View className="flex-1 gap-2">
                <Skeleton height={14} />
                <Skeleton width={120} height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState
              icon={<MessageSquare size={48} color="#A3A3A3" />}
              title="채팅방이 없습니다"
              description="새로운 대화를 시작해보세요"
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(tabs)/chat/${item.id}` as Href)}
              className="flex-row items-center px-4 py-3 active:bg-neutral-50 dark:active:bg-neutral-800"
            >
              <Avatar uri={item.avatar} name={item.name} size="lg" />
              <View className="flex-1 ml-3">
                <View className="flex-row justify-between">
                  <Text
                    className="text-base font-medium text-neutral-900 dark:text-neutral-100"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.lastMessageAt && (
                    <Text className="text-xs text-neutral-400">
                      {new Date(item.lastMessageAt).toLocaleDateString('ko-KR')}
                    </Text>
                  )}
                </View>
                <View className="flex-row justify-between mt-0.5">
                  <Text className="text-sm text-neutral-500 flex-1" numberOfLines={1}>
                    {item.lastMessage ?? '대화를 시작하세요'}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View className="bg-primary-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5 ml-2">
                      <Text className="text-xs text-white font-bold">{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeArea>
  );
}
