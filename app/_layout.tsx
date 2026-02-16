import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar, Text, TextInput } from 'react-native';

// 앱이 로드될 때까지 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. 폰트 파일 로드
  const [loaded, error] = useFonts({
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-ExtraBold': require('../assets/fonts/Pretendard-ExtraBold.ttf'),
  });

  // 2. 에러 발생 시 처리
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 3. 폰트 로딩 완료 시 실행
  useEffect(() => {
    if (loaded) {
      // 앱의 기본 폰트를 Medium으로 설정
      setDefaultFont(); 
      
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 폰트가 아직 로딩 안 됐으면 아무것도 보여주지 않음 (스플래시 화면이 떠 있는 상태)
  if (!loaded) {
    return null;
  }

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

// 전역 기본 폰트 설정 함수 (Text, TextInput 컴포넌트 해킹)
const setDefaultFont = () => {
  const customFont = { fontFamily: 'Pretendard-Medium' };

  // 1. Text 컴포넌트 기본 스타일 변경
  const TextRender = Text as any;
  const oldTextRender = TextRender.render;
  TextRender.render = function (...args: any) {
    const origin = oldTextRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [customFont, origin.props.style],
    });
  };

  // 2. TextInput 컴포넌트 기본 스타일 변경
  const TextInputRender = TextInput as any;
  const oldTextInputRender = TextInputRender.render;
  TextInputRender.render = function (...args: any) {
    const origin = oldTextInputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [customFont, origin.props.style],
    });
  };
};