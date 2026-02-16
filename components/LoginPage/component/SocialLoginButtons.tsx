import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SocialLoginButtons() {
  return (
    <View style={styles.container}>
      {/* 1. 카카오톡 (노랑) */}
      <TouchableOpacity style={styles.circle}>
        <Image
          source={require('@/assets/images/kakaologo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>

      {/* 2. 구글 (흰색) */}
      <TouchableOpacity style={[styles.circle, styles.googleCircle]}>
        <Image
          source={require('@/assets/images/googlelogo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>

      {/* 3. 네이버 (초록) */}
      <TouchableOpacity style={styles.circle}>
        <Image
          source={require('@/assets/images/naverlogo.png')}
          style={styles.logoIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20, // 버튼 사이 간격
    marginBottom: 30,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logoIcon: {
    width: 50, // 아이콘 크기 조절
    height: 50,
    resizeMode: 'contain',
  },
  googleCircle: {
    backgroundColor: '#FFFFFF',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // 그림자가 퍼지는 정도

    // Android shadow
    elevation: 2,
  },
});