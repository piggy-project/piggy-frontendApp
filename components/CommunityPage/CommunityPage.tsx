import React, { useState } from 'react';
import { View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './Community.styles';
import CommunityContainer from './component/CommunityContainer';
import SearchCommunity from './component/SearchCommunity';
import ShowCommunity from './component/ShowCommunity';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('환율 수다방');
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <MainHeader/>
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/* 1. 검색 바 */}
        <SearchCommunity searchText={searchText} setSearchText={setSearchText} />
      
        {/* 2. 탭 메뉴 (setActiveTab을 props로 전달하여 상태 변경 가능하게 구현) */}
        <ShowCommunity activeTab={activeTab} setActiveTab={setActiveTab} />
      
        {/* 3. 필터링된 리스트 컨테이너 */}
        <CommunityContainer activeTab={activeTab} searchText={searchText} />
      </View>
    </View>
  );
}