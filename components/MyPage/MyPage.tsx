import { useAuth } from '@/components/utils/AuthContext';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MyPageHeader from '../Header/MyPageHeader';
import { styles } from './MyPage.styles';
import MyWishlist from './component/MyWishlist';
import ProfileInfo from './component/ProfileInfo';
import UserActivity from './component/UserActivity';

export default function MyPage() {
  const { user, isLoading } = useAuth();

  // 1. 데이터를 불러오는 중일 때 (토큰 체크 중)
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 2. 로딩은 끝났는데 유저 정보가 없는 경우 (예: 토큰 만료)
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>로그인이 필요한 서비스입니다.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MyPageHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ProfileInfo />
        <MyWishlist />
        <UserActivity />
      </View>
    </View>
  );
}