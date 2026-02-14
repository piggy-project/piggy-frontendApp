import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
};

export default function Step4_Nickname({ value, onChange, onNext }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>닉네임을 입력해주세요</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="닉네임을 입력해주세요"
          value={value}
          onChangeText={onChange}
          maxLength={10}
        />
        <Text style={styles.helperText}>* 공백없이 10자 이하 입력</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, value.length === 0 && styles.disabledButton]} 
        onPress={onNext}
        disabled={value.length === 0}
      >
        <Text style={styles.buttonText}>다음</Text>
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
  button: { backgroundColor: '#ddd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#333' },
});