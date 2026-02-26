import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../utils/AuthContext';
import { styles } from './ProfileInfo.styles';

export default function ProfileInfo() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 좌측 프로필 이미지 */}
      <View style={styles.profileImage}>
        <Text style={[styles.imageText, Typography.Pretendard_M_12]}>프로필</Text>
      </View>

      {/* 우측 정보 영역 */}
      <View style={styles.infoContent}>
        <Text style={[styles.nickname, Typography.Pretendard_B_16]}>
          {user?.nickname || '알 수 없음'}
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          //onPress={() => router.push('/profile-edit')}
        >
          <Text style={[styles.editButtonText, Typography.Pretendard_M_12]}>내 정보 수정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}