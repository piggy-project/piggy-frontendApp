import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../components/utils/AuthContext';

// 앱이 로드될 때까지 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// RootLayout: 폰트 로딩 & AuthProvider 제공
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-ExtraBold': require('../assets/fonts/Pretendard-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setDefaultFont();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // AuthProvider로 감싸고, 실제 로직은 AppLayout에서 처리
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

// AppLayout: 실제 네비게이션 & 로그인 체크
function AppLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // 현재 경로에 login이나 signup이 포함되어 있는지 확인
    const isAuthPage = segments.some(segment => segment === 'login' || segment === 'signup');

    if (user && isAuthPage) {
      // 로그인이 되어 있는데 로그인/회원가입 페이지에 있다면 메인으로 이동
      console.log('[AppLayout] 이미 로그인됨 - 메인으로 이동');
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  // 로딩 끝 & 권한 확인 끝 -> 화면 렌더링
  return (
    <>
      <StatusBar
        backgroundColor="#BFD5E5"
        barStyle="dark-content"
      />

      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'default',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}

// 전역 기본 폰트 설정 함수
const setDefaultFont = () => {
  const customFont = { fontFamily: 'Pretendard-Medium' };

  const TextRender = Text as any;
  const oldTextRender = TextRender.render;
  TextRender.render = function (...args: any) {
    const origin = oldTextRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [customFont, origin.props.style],
    });
  };

  const TextInputRender = TextInput as any;
  const oldTextInputRender = TextInputRender.render;
  TextInputRender.render = function (...args: any) {
    const origin = oldTextInputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [customFont, origin.props.style],
    });
  };
};
