import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileInfo.styles';

type Props = {
  onLogout: () => void;
};

export default function ProfileInfo({ onLogout }: Props) {
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
      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}