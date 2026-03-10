import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../utils/AuthContext';
import { styles } from './ProfileInfo.styles';

export default function ProfileInfo() {
  const { user } = useAuth(); // 김유빈 님의 정보를 가져옵니다.
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/profile-detail')}
      activeOpacity={0.7}
    >
      {/* 1. 좌측 프로필 이미지 */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            user?.profileImageUrl
              ? { uri: user.profileImageUrl }
              : require('@/assets/images/basicprofileicon.png')
          }
          style={styles.profileImage}
        />
      </View>

      {/* 2. 중앙 닉네임 영역 (왼쪽 정렬) */}
      <View style={styles.infoContent}>
        <Text style={[styles.nickname, Typography.Pretendard_B_16]}>
          {user?.nickname || '알 수 없음'}
        </Text>
      </View>

      {/* 3. 우측 화살표 아이콘 */}
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}