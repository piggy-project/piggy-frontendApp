import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <>
      <StatusBar
        backgroundColor="#BFD5E5"
        barStyle="dark-content"
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <Stack
          // 이 스택에 포함된 모든 시스템 헤더 끄기
          screenOptions={{
            headerShown: false,
          }}
        >

          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaView>
    </>
  );
}