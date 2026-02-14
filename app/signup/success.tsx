import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupSuccess() {
  const router = useRouter();

  const handleFinish = () => {
    // 모든 스택을 지우고 로그인 화면으로 이동
    // (또는 router.replace('/(tabs)/mypage')로 자동 로그인 처리 가능)
    router.dismissAll(); 
    router.replace('/login'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>회원가입 완료!</Text>
        <Text style={styles.subTitle}>이제 PIGGY와 함께{'\n'}똑똑한 여행을 시작해보세요.</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>로그인하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  content: { alignItems: 'center', marginBottom: 50 },
  emoji: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
  button: { backgroundColor: '#333', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 8, position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});