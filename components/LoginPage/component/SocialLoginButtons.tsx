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
  const BACKEND_URL = 'http://localhost.nip.io:8080'; 

  // 3. 소셜 로그인 처리 함수
  const handleSocialLogin = async (provider: 'kakao' | 'google' | 'naver') => {
    try {
      const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}`;
      const returnUrl = 'http://localhost:3000/oauth/success';

      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

      if (result.type === 'success' && result.url) {
        const urlObj = new URL(result.url);
        const params = new URLSearchParams(urlObj.search);
        const token = params.get('token');

        if (token) {
          console.log(`${provider} 로그인 성공! 토큰:`, token);
          await loginWithToken(token);
          router.replace('/(tabs)');
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