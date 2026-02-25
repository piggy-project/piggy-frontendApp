import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShowCommunity.styles';

// 1. Props 타입 정의
interface ShowCommunityProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// 2. 인자값으로 부모의 상태와 함수를 받아옴
const ShowCommunity = ({ activeTab, setActiveTab }: ShowCommunityProps) => {
  const tabs = ['환율 수다방', '여행 공유방', '정보방'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          // 3. 내부 상태 변경이 아닌 부모에서 받은 함수 호출
          onPress={() => setActiveTab(tab)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <Text style={[[styles.tabText, Typography.Pretendard_M_16], activeTab === tab && [styles.activeTabText, Typography.Pretendard_M_16]]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ShowCommunity;