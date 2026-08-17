import { communityApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './HotPost.styles';

const HotPost = () => {
  const router = useRouter();

  // 1. 실시간 핫 게시물(1위) 데이터 가져오기
  const { data: hotPost, isLoading } = useQuery({
    queryKey: ['hotPost'],
    queryFn: () => communityApi.getTopHotPost(),
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
  });

  // 로딩 중이거나 데이터가 없으면 표시하지 않음
  if (isLoading || !hotPost) return null;

  const handlePress = () => {
    if (!hotPost?.id || isNaN(Number(hotPost.id))) {
      console.warn("유효하지 않은 게시글 ID입니다.");
      return;
    }

    router.push({
      pathname: '/community_detail',
      params: { id: String(hotPost.id) }
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.contentRow}>
        {/* 왼쪽: 불 아이콘 + 제목 */}
        <View style={styles.leftSection}>
          <Ionicons name="flame" size={16} color="#FF7088" style={styles.fireIcon} />
          <Text
            style={[styles.title, Typography.Pretendard_M_14]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {hotPost.title}
          </Text>
        </View>

        {/* 오른쪽: 좋아요 & 댓글 수 */}
        <View style={styles.rightSection}>
          <View style={styles.statItem}>
            <Ionicons name="thumbs-up-outline" size={12} color="#888" />
            <Text style={[styles.statText, Typography.Pretendard_M_11]}>{hotPost.likeCount}</Text>
          </View>
          <View style={[styles.statItem, { marginLeft: 8 }]}>
            <Image
              source={require('@/assets/images/chaticon.png')}
              style={{ width: 16, height: 16, tintColor: '#888' }}
              resizeMode="contain"
            />
            <Text style={[styles.statText, Typography.Pretendard_M_11]}>{hotPost.commentCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HotPost;