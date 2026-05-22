import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateData } = useSignupData();
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // 8자 이상으로 기준 변경 및 조건 분리
  const isLengthValid = password.length >= 8;
  const isMatch = password === confirmPw;
  const isValid = isLengthValid && isMatch;

  // 에러 메시지 표시 조건
  const showLengthError = password.length > 0 && !isLengthValid;
  const showMismatchError = confirmPw.length > 0 && !isMatch;

  const handleNext = () => {
    if (isValid) {
      updateData({ password });
      router.push('/signup/personal-info');
    }
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
        
        {showLengthError ? (
          <Text style={[styles.errorText, Typography.Pretendard_M_11]}>비밀번호는 8자 이상입니다.</Text>
        ) : (
          <Text style={[styles.helperText, Typography.Pretendard_M_11]}>- 8자 이상 30자 이하 입력</Text>
        )}

        <TextInput 
          style={[styles.input, { marginTop: 30 }, Typography.Pretendard_M_14]}
          placeholder="비밀번호를 한번 더 입력해주세요"
          value={confirmPw}
          onChangeText={setConfirmPw}
          secureTextEntry
        />
        
        {showMismatchError && (
          <Text style={[styles.errorText, Typography.Pretendard_M_11, { marginTop: 5 }]}>
            비밀번호가 일치하지 않습니다.
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          !isValid && styles.disabledButton,
          { marginBottom: Math.max(insets.bottom, 20) }
        ]} 
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
  errorText: { color: '#FF3B30', marginTop: 5 }, // 조금 더 선명한 iOS 스타일 레드로 변경
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});