import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
};

export default function Step2_Email({ value, onChange, onNext }: Props) {
  // 이메일 유효성 검사 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // 현재 입력값이 유효한지 확인
  const isValid = emailRegex.test(value);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>이메일을 입력해주세요</Text>
        <TextInput 
          style={styles.input}
          placeholder="이메일을 입력해주세요"
          value={value}
          onChangeText={onChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* 입력은 했는데 형식이 틀릴 경우 에러 메시지 표시 */}
        {value.length > 0 && !isValid && (
          <Text style={styles.errorText}>올바른 이메일 형식이 아닙니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        // 유효하지 않으면 버튼 비활성화
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
  errorText: { color: 'red', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButtonText: { color: '#aaa' },
});