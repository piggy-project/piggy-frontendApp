import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
};

export default function Step3_Password({ value, onChange, onNext }: Props) {
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 1. 유효성 검사 (버튼 활성화용): 6자 이상이고, 두 비밀번호가 같아야 함
  const isValid = value.length >= 6 && value === confirmPassword;

  // 2. 불일치 여부 확인 (에러 메시지용): 확인란에 입력은 했는데, 비밀번호와 다를 때
  const isMismatch = confirmPassword.length > 0 && value !== confirmPassword;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>비밀번호를 입력해주세요</Text>
        
        {/* 첫 번째: 비밀번호 입력 */}
        <TextInput 
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          secureTextEntry
          value={value}
          onChangeText={onChange}
        />
        <Text style={styles.helperText}>* 6자 이상 30자 이하 입력</Text>

        {/* 두 번째: 비밀번호 확인 입력 */}
        <TextInput 
          style={[styles.input, { marginTop: 30 }]}
          placeholder="비밀번호를 한번 더 입력해주세요"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* 3. 에러 메시지 표시 */}
        {isMismatch && (
          <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isValid && styles.disabledButton]} 
        onPress={onNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff' },
  content: { marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 18, paddingVertical: 10 },
  helperText: { marginTop: 10, color: '#888', fontSize: 12 },
  
  // 에러 메시지 스타일 추가
  errorText: { marginTop: 10, color: '#FF3B30', fontSize: 14 },

  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButtonText: { color: '#aaa' },
});