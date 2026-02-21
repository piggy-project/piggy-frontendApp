import { Typography } from '@/constants/Typography';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export default function LoginButton({ onPress, disabled }: Props) {
  return (
    <TouchableOpacity 
      // 활성화 상태(!disabled)일 때 active 스타일이 적용되도록 합니다.
      style={[styles.button, !disabled ? styles.activeButton : styles.disabledButton]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text, 
        Typography.Pretendard_M_16,
        // 비활성화 시 글자 색상도 연하게 변경
        { color: !disabled ? '#fff' : '#999' } 
      ]}>
        로그인
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  // 활성화 상태: 진한 배경
  activeButton: {
    backgroundColor: '#333',
  },
  // 비활성화 상태: 연한 배경
  disabledButton: {
    backgroundColor: '#ddd',
  },
  text: {
    // 기본 스타일 (Typography가 덮어씌움)
  },
});