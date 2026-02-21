import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';
import { Typography } from '@/constants/Typography';

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
        <Text style={[styles.title, Typography.Pretendard_B_24]}>비밀번호를 입력해주세요</Text>
        
        <TextInput 
          style={[styles.input, Typography.Pretendard_M_14]}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={[styles.helperText, Typography.Pretendard_M_11]}>- 6자 이상 30자 이하 입력</Text>

        <TextInput 
          style={[styles.input, { marginTop: 30 }, Typography.Pretendard_M_14]}
          placeholder="비밀번호를 한번 더 입력해주세요"
          value={confirmPw}
          onChangeText={setConfirmPw}
          secureTextEntry
        />
        
        {isMismatch && (
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>비밀번호가 일치하지 않습니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isValid && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { marginBottom: 30 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 },
  helperText: { marginTop: 5, color: '#888' },
  errorText: { color: 'red', marginTop: 10 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});