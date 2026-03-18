import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#C5A059', // Curator Gold
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarStyle: styles.stickyTabBar,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[styles.androidBackground, { backgroundColor: isDark ? '#111' : '#FFF' }]} />
          )
        ),
        tabBarLabelStyle: styles.labelStyle,
      }}>
      
      {/* 1. HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. EXPLORE (The Archive) */}
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. ABOUT */}
      <Tabs.Screen
        name="explore" 
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  stickyTabBar: {
    position: 'absolute', // Keeps it over the content
    height: Platform.OS === 'ios' ? 88 : 65, // Standard height + safe area for iOS
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    elevation: 0,
    backgroundColor: Platform.OS === 'android' ? 'white' : 'transparent',
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  labelStyle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Platform.OS === 'ios' ? 0 : 10,
  }
});