import SearchCommunity from '@/components/CommunityPage/component/SearchCommunity';
import React from 'react';
import { View } from 'react-native';
import BaseHeader from './BaseHeader';
import Notice from './component/Notice';
import { styles as baseStyles } from './BaseHeader.styles';

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function CommunityHeader({ searchText, setSearchText }: Props) {
  return (
    <BaseHeader
      // 1. 왼쪽 공간을 최소화
      leftStyle={baseStyles.shrinkSideArea} 
      left={null}

      // 2. 중앙을 최대한 넓게 설정
      centerStyle={baseStyles.wideCenterArea} 
      center={
        <SearchCommunity 
          searchText={searchText} 
          setSearchText={setSearchText} 
        />
      }

      // 3. 오른쪽(알림 아이콘) 공간 설정
      rightStyle={baseStyles.shrinkSideArea}
      right={
        <Notice />
      }
    />
  );
}