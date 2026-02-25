import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './CommunityContainer.styles';
import CommunityPost from './CommunityPost';

interface ContainerProps {
  activeTab: string;
  searchText: string;
}

const CommunityContainer = ({ activeTab, searchText }: ContainerProps) => {
  // 전체 데이터 (보통 API에서 가져오거나 상위에서 관리)
  const allPosts = [
    { id: 1, category: '환율 수다방', user: '엉망진창 고등어', time: '1시간 전', content: '오늘 엔화 환율 어때요?', likes: 10, comments: 5 },
    { id: 2, category: '환율 수다방', user: '알뜰한 고래', time: '2시간 전', content: '달러 가즈아', likes: 50, comments: 20 },
    { id: 3, category: '여행 공유방', user: '떠나자 도다리', time: '3시간 전', content: '일본 맛집 추천좀', likes: 100, comments: 80 },
    { id: 4, category: '정보방', user: '정보왕 상어', time: '5분 전', content: '수수료 우대 꿀팁', likes: 200, comments: 150 },
  ];

  // 필터링 로직: 1. 탭 분류 -> 2. 제목(content) 검색
  const filteredPosts = allPosts.filter((post) => {
    const matchesTab = post.category === activeTab;
    const matchesSearch = post.content.toLowerCase().includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <CommunityPost key={post.id} {...post} />)
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
            검색 결과가 없습니다.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default CommunityContainer;