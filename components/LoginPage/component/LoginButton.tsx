import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export default function LoginButton({ onPress, disabled }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>로그인</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ddd', // 활성화 시 색상 변경 가능
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});