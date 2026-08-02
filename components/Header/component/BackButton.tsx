import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // 뒤로 갈 수 있는지 먼저 확인
      if (router.canGoBack()) {
        router.back();
      } else {
      }
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Image 
                source={require('@/assets/images/backbutton.png')} 
                style={styles.button} 
                resizeMode="contain"
              />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
