import { getAccessToken } from '@/components/utils/authStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import CommunityHeader from '../Header/CommunityHeader';
import { styles } from './Community.styles';
import CommunityContainer from './component/CommunityContainer';
import HotPost from './component/HotPost';
import SearchCommunity from './component/SearchCommunity';
import ShowCommunity from './component/ShowCommunity';

export default function CommunityPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('환율게시판');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleWritePress = async () => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인하러 가기', onPress: () => router.push('/(tabs)/mypage') }
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

  const handleSearch = (query: string) => {
    setSearchText(query);
    setIsSearchMode(false);
  };

  const handleExitSearchMode = () => {
    setIsSearchMode(false);
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      {isSearchMode ? (
        <View style={styles.searchModeScreen}>
          <SearchCommunity
            variant="search"
            autoFocus
            onBack={handleExitSearchMode}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </View>
      ) : (
        <>
          <CommunityHeader onFocus={() => setIsSearchMode(true)} />

          <View style={[styles.sectionGap, { flex: 1 }]}>
            <ShowCommunity
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeCode={activeCode}
              setActiveCode={setActiveCode}
              onInteract={handleClearSearch}
            />

            <HotPost />

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
        </>
      )}
    </View>
  );
}