import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

// 1. Props 타입 정의: onPress는 '선택 사항'
type Props = {
  onPress?: () => void;
};

// 2. onPress를 props로 받습니다.
export default function BackButton({ onPress }: Props) {
  const router = useRouter();

  const handlePress = () => {
    // 3. 만약 외부에서 onPress를 넣어줬다면 그걸 실행 (커스텀 동작)
    if (onPress) {
      onPress();
    } else {
      // 4. 안 넣어줬다면 원래대로 라우터 뒤로가기 실행 (기본 동작)
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="arrow-back" size={26} color="gray" />
    </TouchableOpacity>
  );
}