import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../utils/AuthContext';
import { styles } from './ProfileInfo.styles';

type Props = {
  onLogout: () => void;
};

export default function ProfileInfo({ onLogout }: Props) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 (회색 박스) */}
      <View style={styles.profileImage}>
        <Text style={styles.imageText}>프로필</Text>
      </View>

      <Text style={styles.nickname}>
        {user?.nickname || '알 수 없음'}
      </Text>

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