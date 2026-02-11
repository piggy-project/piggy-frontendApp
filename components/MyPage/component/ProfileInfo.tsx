import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileInfo.styles';

export default function ProfileInfo() {
  return (
    <View style={styles.container}>
      {/* 프로필 이미지 (회색 박스) */}
      <View style={styles.profileImage}>
        <Text style={styles.imageText}>프로필</Text>
      </View>

      <Text style={styles.nickname}>닉네임 1234</Text>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>내 정보 수정</Text>
      </TouchableOpacity>
    </View>
  );
}