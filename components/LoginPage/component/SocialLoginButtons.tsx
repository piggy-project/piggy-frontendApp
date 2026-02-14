import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SocialLoginButtons() {
  return (
    <View style={styles.container}>
      {/* 네이버 */}
      <TouchableOpacity style={[styles.circle, { backgroundColor: '#03C75A' }]}>
        <Text style={styles.socialText}>N</Text>
      </TouchableOpacity>

      {/* 카카오 */}
      <TouchableOpacity style={[styles.circle, { backgroundColor: '#FEE500' }]}>
        <Text style={[styles.socialText, { color: '#000' }]}>K</Text>
      </TouchableOpacity>

      {/* 구글 */}
      <TouchableOpacity style={[styles.circle, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]}>
        <Text style={[styles.socialText, { color: '#EA4335' }]}>G</Text>
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
    elevation: 2, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});