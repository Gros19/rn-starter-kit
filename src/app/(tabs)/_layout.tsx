import { Tabs } from 'expo-router';
import React from 'react';
import { Home, MessageSquare, CheckSquare, User } from 'lucide-react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MiniPlayer } from '@/components/player/mini-player';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: '채팅',
            tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="todo"
          options={{
            title: '할 일',
            tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '프로필',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
        {/* 기존 explore 탭 숨김 */}
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
      <MiniPlayer />
    </>
  );
}
