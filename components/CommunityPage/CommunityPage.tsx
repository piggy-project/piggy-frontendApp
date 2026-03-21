import { getToken } from '@/components/utils/authStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import CommunityHeader from '../Header/CommunityHeader';
import { styles } from './Community.styles';
import CommunityContainer from './component/CommunityContainer';
import HotPost from './component/HotPost';
import ShowCommunity from './component/ShowCommunity';

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('환율 수다방');
  const [searchText, setSearchText] = useState('');

  const handleWritePress = async () => {
    const token = await getToken(); //

    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '로그인하러 가기',
            onPress: () => router.push('/login')
          }
        ]
      );
      return; // 로그인이 안 되어 있으면 여기서 함수 종료
    }

    router.push({
      pathname: '/community_write',
      params: { initialCategory: activeTab }
    });
  };

  return (
    <View style={styles.container}>
      <CommunityHeader 
        searchText={searchText} 
        setSearchText={setSearchText} 
      />
      <View style={[styles.sectionGap, { flex: 1 }]}>


        {/* 1. 탭 메뉴 (setActiveTab을 props로 전달하여 상태 변경 가능하게 구현) */}
        <ShowCommunity activeTab={activeTab} setActiveTab={setActiveTab} />

        <HotPost />
        {/* 2. 필터링된 리스트 컨테이너 */}
        <CommunityContainer activeTab={activeTab} searchText={searchText} />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleWritePress}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ 글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
}