import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../utils/AuthContext';
import { styles } from './ProfileInfo.styles';

export default function ProfileInfo() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // 로그아웃 후 환영 페이지로 강제 이동
      router.replace('/signup'); 
    } catch (e) {
      console.error('로그아웃 실패:', e);
      Alert.alert('오류', '로그아웃에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImage}>
        <Text style={styles.imageText}>프로필</Text>
      </View>

      <Text style={styles.nickname}>
        {user?.nickname || '알 수 없음'}
      </Text>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>내 정보 수정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}