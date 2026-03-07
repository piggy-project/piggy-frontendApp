import NoneHeader from '@/components/Header/NoneHeader';
import { communityApi } from '@/components/utils/api';
import { getToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // 📍 깔끔하게 통합
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'; // 📍 useEffect, useState 삭제 가능 (필요 시에만 추가)
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './CommunityDetail.styles';

export default function CommunityDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. 상세 데이터 조회 (useQuery)
  // isLoading, data 등을 여기서 한 번에 관리합니다.
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', Number(id)],
    queryFn: () => communityApi.getPostDetail(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // 2. 좋아요 처리 (useMutation)
  const likeMutation = useMutation({
    mutationFn: () => communityApi.toggleLike(Number(id)),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', Number(id)] });
    },
    onError: (error: any) => {
      Alert.alert('오류', error.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
  });

  // 좋아요 핸들러
  const handleLike = async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인하러 가기', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    likeMutation.mutate();
  };

  // 4. 로딩 및 에러 처리
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB7C5" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text>게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NoneHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 카테고리 뱃지 */}
        <View style={styles.categoryBadge}>
          <Text style={[Typography.Pretendard_B_16, styles.categoryText]}>{post.category}</Text>
        </View>

        {/* 제목 */}
        <Text style={[Typography.Pretendard_B_24, styles.title]}>{post.title}</Text>

        {/* 작성자 정보 */}
        <View style={styles.authorRow}>
          <View style={styles.profileCircle} />
          <View>
            <Text style={[Typography.Pretendard_B_16, styles.authorName]}>{post.authorNickname}</Text>
            <Text style={[Typography.Pretendard_M_12, styles.dateText]}>
              {new Date(post.createdAt).toLocaleDateString()} · 조회 {post.viewCount}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 본문 내용 */}
        <Text style={[Typography.Pretendard_M_16, styles.content]}>{post.content}</Text>

        {/* 하단 인터랙션 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.interactionItem}
            onPress={handleLike}
            activeOpacity={0.7}
            disabled={likeMutation.isPending}
          >
            <Ionicons
              name={post.isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={22}
              color={post.isLiked ? "#FFB7C5" : "#888"}
            />
            <Text style={[
              styles.interactionText,
              post.isLiked && { color: "#FFB7C5", fontWeight: 'bold' }
            ]}>
              {post.likeCount}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}