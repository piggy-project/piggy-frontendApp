import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupPassword() {
  const router = useRouter();
  const { updateData } = useSignupData();
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const isValid = password.length >= 6 && password === confirmPw;
  const isMismatch = confirmPw.length > 0 && password !== confirmPw;

  const handleNext = () => {
    updateData({ password });
    router.push('/signup/personal-info');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>비밀번호를 설정해주세요</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.helperText}>* 6자 이상 30자 이하 입력</Text>

        <TextInput 
          style={[styles.input, { marginTop: 30 }]}
          placeholder="비밀번호 확인"
          value={confirmPw}
          onChangeText={setConfirmPw}
          secureTextEntry
        />
        
        {isMismatch && (
          <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
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
  helperText: { marginTop: 5, color: '#888', fontSize: 12 },
  errorText: { color: 'red', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});