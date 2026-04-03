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
  code: string;
  authorNickname: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  imageUrl: string | null;
}

interface ContainerProps {
  activeTab: string;
  activeCode: string | null;
  searchText: string;
}

// 한글 탭 이름을 백엔드 Enum 값으로 매핑하는 객체
const categoryMap: Record<string, string> = {
  '자유게시판': 'FREE',
  '환율게시판': 'EXCHANGE',
  '여행게시판': 'TRAVEL',
};

const CommunityContainer = ({ activeTab, activeCode, searchText }: ContainerProps) => {
  const [userRefreshing, setUserRefreshing] = useState(false);

  // 탭 이름 변환 (예: '환율게시판' -> 'EXCHANGE')
  const mappedCategory = categoryMap[activeTab] || 'FREE';

  const { 
    data: posts = [], 
    isLoading, 
    refetch 
  } = useQuery<PostData[]>({
    // queryKey에 activeCode를 추가해야 코드가 바뀔 때마다 데이터를 새로 가져옵니다.
    queryKey: ['posts', mappedCategory, activeCode, searchText], 
    
    // API 호출 시 category, code, search 세 가지 인자를 전달
    queryFn: () => communityApi.getPosts(mappedCategory, activeCode || '', searchText),
    
    staleTime: 1000 * 60, 
  });

  const onRefresh = async () => {
    setUserRefreshing(true);
    await refetch();
    setUserRefreshing(false);
  };

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
              code={post.code}
              user={post.authorNickname}
              time={formatTime(post.createdAt)}
              title={post.title}
              content={post.content}
              likes={post.likeCount}
              comments={post.commentCount ?? 0}
              isLiked={post.isLiked}
              imageUrl={post.imageUrl}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
            {activeCode ? `${activeCode} 게시판에 검색 결과가 없습니다.` : '검색 결과가 없습니다.'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

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