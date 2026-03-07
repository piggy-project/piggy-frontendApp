import { communityApi } from '@/components/utils/api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { styles } from './CommunityContainer.styles';
import CommunityPost from './CommunityPost';

interface PostData {
  id: number;
  title: string;
  content: string;
  category: string;
  authorNickname: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

interface ContainerProps {
  activeTab: string;
  searchText: string;
}

const CommunityContainer = ({ activeTab, searchText }: ContainerProps) => {
  const [userRefreshing, setUserRefreshing] = useState(false);
  // 모든 상태 관리는 useQuery 사용
  const { 
    data: posts = [], 
    isLoading, 
    isFetching, 
    refetch 
  } = useQuery<PostData[]>({
    queryKey: ['posts', activeTab, searchText],
    queryFn: () => communityApi.getPosts(activeTab, searchText),
    staleTime: 1000 * 60, // 1분간은 캐시 데이터를 즉시 사용
  });

  // 수동 새로고침 함수
  const onRefresh = async () => {
    setUserRefreshing(true); // 아이콘 보여주기
    await refetch();         // 데이터 다시 가져오기
    setUserRefreshing(false); // 아이콘 숨기기
  };

  // 로딩 상태 처리
  // 첫 로딩일 때만 큰 인디케이터 사용
  if (isLoading && posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', marginTop: 50 }}>
        <ActivityIndicator size="large" color="#FFB7C5" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={userRefreshing}
          onRefresh={onRefresh} 
          tintColor="#FFB7C5" 
        />
      }
    >
      <View style={styles.inner}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <CommunityPost 
              key={post.id} 
              id={post.id} 
              category={post.category}
              user={post.authorNickname}
              time={formatTime(post.createdAt)}
              content={post.title}
              likes={post.likeCount}
              comments={0}
              isLiked={post.isLiked}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
            검색 결과가 없습니다.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// 간단한 시간 포맷팅 (예: 2026-03-07T...)
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default CommunityContainer;