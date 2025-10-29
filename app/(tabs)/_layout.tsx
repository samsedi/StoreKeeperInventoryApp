import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
            tabBarStyle: {
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderTopWidth: 0,
      elevation: 0,
    },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'add product',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cube-outline" color={color} />,
        }}
      />

            <Tabs.Screen
        name="view"
        options={{
          title: 'view',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cart" color={color} />,
        }}
      />
    </Tabs>
  );
}
