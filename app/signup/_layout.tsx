import { Stack } from 'expo-router';
import { SignupProvider } from '../../components/utils/SignupContext';

export default function SignupLayout() {
  return (
    // 모든 단계에서 데이터를 공유하도록 Provider로 감쌈
    <SignupProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,    // 헤더 숨기기
          gestureEnabled: true,  // 아이폰 스와이프 뒤로가기 켜기
          animation: 'default'   // 기본 슬라이드 애니메이션
        }}
      >
        {/* Step 0: 웰컴 화면 */}
        <Stack.Screen name="index" />

        {/* Step 1: 약관 동의 */}
        <Stack.Screen name="terms" />

        {/* Step 2: 이메일 입력 */}
        <Stack.Screen name="email" />

        {/* Step 3: 비밀번호 입력 */}
        <Stack.Screen name="password" />

        {/* Step 4: 개인정보 입력 (이름, 생년월일, 전화번호) */}
        {/* 파일명을 personal-info.tsx 로 만드세요 */}
        <Stack.Screen name="personal-info" />

        {/* Step 5: 닉네임 입력 */}
        <Stack.Screen name="nickname" />

        {/* Step 6: 가입 성공 */}
        {/* 성공 화면에서는 뒤로가기 막음 */}
        <Stack.Screen 
          name="success" 
          options={{ gestureEnabled: false }} 
        />
      </Stack>
    </SignupProvider>
  );
}