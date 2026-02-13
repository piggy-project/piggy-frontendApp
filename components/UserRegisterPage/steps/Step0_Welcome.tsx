// components/UserRegisterPage/steps/Step0_Welcome.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onNext: () => void; // "회원가입" 버튼 누르면 다음 단계로 이동
  onLoginPress?: () => void; // "로그인" 눌렀을 때의 동작 (필요시 구현)
};

export default function Step0_Welcome({ onNext, onLoginPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>환율로 똑똑하게{'\n'}떠나는 여행</Text>
        <Text style={styles.subTitle}>최적의 환율 타이밍으로 여행을 계획하세요!</Text>
        
        {/* 캐릭터 이미지 Placeholder */}
        <View style={styles.circlePlaceholder}>
          <Text style={styles.placeholderText}>캐릭터</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {/* 회원가입 버튼 -> 다음 단계로 이동 */}
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>

        {/* 로그인 링크 */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>이미 회원이신가요? </Text>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={styles.loginLink}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'space-between' },
  content: { marginTop: 60, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, lineHeight: 36 },
  subTitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  circlePlaceholder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#666' },
  footer: { marginBottom: 20 },
  button: { backgroundColor: '#ddd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#666' },
  loginLink: { fontWeight: 'bold', color: '#333', textDecorationLine: 'underline' },
});