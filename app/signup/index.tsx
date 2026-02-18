import SocialLoginButtons from '@/components/LoginPage/component/SocialLoginButtons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupWelcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>환율로 떠나는{'\n'}똑똑한 여행</Text>
        <Text style={styles.subTitle}>PIGGY에 오신것을 환영해요!</Text>
        <View style={styles.circlePlaceholder}>
          <Text style={styles.placeholderText}>캐릭터</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <SocialLoginButtons />
        
        <View style={styles.emailActionContainer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.emailActionText}>이메일 로그인</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          {/* 다음 단계(약관)로 이동 */}
          <TouchableOpacity onPress={() => router.push('/signup/terms')}>
            <Text style={styles.emailActionText}>이메일 회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 80, paddingBottom: 60, backgroundColor: '#fff', justifyContent: 'space-between' },
  topContent: { alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, lineHeight: 38, color: '#333' },
  subTitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 50 },
  circlePlaceholder: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#888', fontSize: 16 },
  footer: { alignItems: 'center', gap: 30 },
  emailActionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 },
  emailActionText: { fontSize: 14, color: '#555', fontWeight: '500' },
  divider: { color: '#ccc', fontSize: 14 }
});