import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, Text, TextInput, View } from 'react-native';
import { AuthProvider, useAuth } from '../components/utils/AuthContext';

// 앱이 로드될 때까지 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

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
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

// AppLayout: 실제 네비게이션 & 로그인 체크
function AppLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 로딩 중(토큰 확인 중)이면 대기
    if (isLoading) return;

    // 현재 경로가 로그인/회원가입 그룹인지 확인
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (user && inAuthGroup) {
      // 로그인 상태인데 로그인 화면에 있다면 -> 메인으로 보냄
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  // 로딩 중일 때는 화면 가운데 뺑뺑이(Spinner) 보여줌
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