import SearchCommunity from '@/components/CommunityPage/component/SearchCommunity';
import React from 'react';
import { View } from 'react-native';
import BaseHeader from './BaseHeader';
import Notice from './component/Notice';

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function CommunityHeader({ searchText, setSearchText }: Props) {
  return (
    <BaseHeader
      // 1. 왼쪽 공간을 최소화 (flex: 1을 끄는 효과)
      leftStyle={{ flex: 0 }} 
      left={<View style={{ width: 0 }} />}

      // 2. 중앙을 최대한 넓게 설정 (flex 비율을 높이고 stretch 적용)
      centerStyle={{ flex: 1, alignItems: 'stretch' }} 
      center={
        <SearchCommunity 
          searchText={searchText} 
          setSearchText={setSearchText} 
        />
      }

      // 3. 오른쪽(알림 아이콘) 공간 설정
      rightStyle={{ flex: 0 }}
      right={
        <View style={{ marginBottom: 0 }}>
          <Notice />
        </View>
      }
    />
  );
}