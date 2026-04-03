import { getAccessToken } from '@/components/utils/authStore';
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
  
  // 1. 탭 이름 일치 (ShowCommunity의 tabs 배열과 맞춤)
  const [activeTab, setActiveTab] = useState('환율게시판'); 
  
  // 2. 선택된 통화 코드 상태 추가 (USD, JPY 등)
  const [activeCode, setActiveCode] = useState<string | null>(null);
  
  const [searchText, setSearchText] = useState('');

  const handleWritePress = async () => {
    const token = await getAccessToken();

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
      return;
    }
    router.push({
      pathname: '/community_write',
      params: { 
        initialCategory: activeTab,
        initialCode: activeCode || '' 
      }
    });
  };

  return (
    <View style={styles.container}>
      <CommunityHeader 
        searchText={searchText} 
        setSearchText={setSearchText} 
      />
      <View style={[styles.sectionGap, { flex: 1 }]}>

        {/* 3. ShowCommunity에 필요한 4개의 Props 모두 전달 */}
        <ShowCommunity 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeCode={activeCode}
          setActiveCode={setActiveCode}
        />

        <HotPost />

        {/* 4. 필터링된 리스트에도 activeCode를 넘겨야 백엔드에서 해당 국가 글만 가져옵니다. */}
        <CommunityContainer 
          activeTab={activeTab} 
          activeCode={activeCode}
          searchText={searchText} 
        />
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