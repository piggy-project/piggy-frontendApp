import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupEmail() {
  const router = useRouter();
  const { updateData } = useSignupData();
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  const handleNext = () => {
    updateData({ email });
    router.push('/signup/password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인에 사용할{'\n'}이메일을 입력해주세요</Text>
        <TextInput 
          style={styles.input}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* 에러 메시지 복구 */}
        {email.length > 0 && !isValid && (
          <Text style={styles.errorText}>올바른 이메일 형식이 아닙니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isValid && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 18, paddingVertical: 10 },
  errorText: { color: 'red', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});