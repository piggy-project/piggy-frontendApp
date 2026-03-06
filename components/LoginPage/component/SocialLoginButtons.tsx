import { useAuth } from '@/components/utils/AuthContext';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// 1. 브라우저가 닫힐 때까지 대기하도록 설정
WebBrowser.maybeCompleteAuthSession();

export default function SocialLoginButtons() {
  const { loginWithToken } = useAuth();
  const router = useRouter();

  // 2. 백엔드 주소 설정
  const BACKEND_URL = 'https://piggys.mooo.com';

  // 3. 소셜 로그인 처리 함수
  const handleSocialLogin = async (provider: 'kakao' | 'google' | 'naver') => {
    try {
      const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}?target=app`;
      // 백엔드가 리다이렉트할 베이스 주소
      const returnUrl = 'exp://localhost:8081';

      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

      if (result.type === 'success' && result.url) {
        const url = result.url;
        const params = new URLSearchParams(url.split('?')[1]);

        // 1. 에러 처리 로직 (oauth/error 경로 확인)
        // 1. 에러 처리 로직 (oauth/error 경로 확인)
        if (url.includes('/oauth/error')) {
          const rawErrorMessage = params.get('message');

          if (rawErrorMessage) {
            // 일단 한글로 복구
            const decodedMsg = decodeURIComponent(rawErrorMessage);
            let finalMessage = decodedMsg; // 기본은 서버 메시지

            // 2. 메시지 커스텀 로직
            if (decodedMsg.includes('카카오')) {
              finalMessage = "이미 카카오 계정으로 가입되어 있네요!\n카카오 로그인을 이용해 주세요.";
            } else if (decodedMsg.includes('네이버')) {
              finalMessage = "이미 네이버 계정으로 가입되어 있네요!\n네이버 로그인을 이용해 주세요.";
            } else if (decodedMsg.includes('구글')) {
              finalMessage = "이미 네이버 계정으로 가입되어 있네요!\n구글 로그인을 이용해 주세요.";
            } else if (decodedMsg.includes('일반 이메일')) {
              finalMessage = "이미 일반 계정으로 가입되어 있네요!!\n이메일 계정 로그인을 이용해 주세요.";
            }

            Alert.alert('확인해 주세요', finalMessage);
            return;
          }
        }

        const token = params.get('token');
        const refreshToken = params.get('refreshToken');

        if (token) {
          if (url.includes('additional-info')) {
            router.push({
              pathname: '/oauth/additional-info',
              params: { token }
            });
          } else {
            await loginWithToken(token);
            router.replace('/(tabs)');
          }
        } else {
          Alert.alert('오류', '토큰을 찾을 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('Social Login Error:', error);
      Alert.alert('로그인 실패', '소셜 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. 카카오톡 */}
      <TouchableOpacity
        style={styles.circle}
        onPress={() => handleSocialLogin('kakao')}
      >
        <Image
          source={require('@/assets/images/kakaologo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>

      {/* 2. 구글 */}
      <TouchableOpacity
        style={[styles.circle, styles.googleCircle]}
        onPress={() => handleSocialLogin('google')}
      >
        <Image
          source={require('@/assets/images/googlelogo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>

      {/* 3. 네이버 */}
      <TouchableOpacity
        style={styles.circle}
        onPress={() => handleSocialLogin('naver')}
      >
        <Image
          source={require('@/assets/images/naverlogo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  googleCircle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});