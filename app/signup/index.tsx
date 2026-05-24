import SocialLoginButtons from '@/components/LoginPage/component/SocialLoginButtons';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function SignupWelcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => router.replace('/')} // 홈으로 이동
      >
        <Ionicons name="close" size={30} color="#333" />
      </TouchableOpacity>
      <View style={styles.topContent}>
        <Image 
          source={require('@/assets/images/signupPiggy.png')} 
          style={styles.piggyImage} 
          resizeMode="contain"
        />
        <Text style={[styles.title, Typography.Pretendard_B_32]}>환율로 떠나는{'\n'}똑똑한 여행</Text>
        <Text style={[styles.subTitle, Typography.Pretendard_M_14]}>PIGGY에 오신것을 환영해요!</Text>
        
      </View>

      <View style={styles.footer}>
        <SocialLoginButtons />
        
        <View style={styles.emailActionContainer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.emailActionText, Typography.Pretendard_M_14]}>이메일 로그인</Text>
          </TouchableOpacity>
          <Text style={[styles.divider, Typography.Pretendard_M_14]}>|</Text>
          {/* 다음 단계(약관)로 이동 */}
          <TouchableOpacity onPress={() => router.push('/signup/terms')}>
            <Text style={[styles.emailActionText, Typography.Pretendard_M_14]}>이메일 회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 60,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 50,
  },
  piggyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subTitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  footer: {
    alignItems: 'center',
    gap: 30,
  },
  emailActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  emailActionText: {
    color: '#555',
  },
  divider: {
    color: '#ccc',
  },
});