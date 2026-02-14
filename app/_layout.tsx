import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar
        backgroundColor="#BFD5E5"
        barStyle="dark-content"
      />

      <Stack
        screenOptions={{
          headerShown: false,       // 헤더 숨기기
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'default',
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}