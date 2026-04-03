import { communityApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './CommunityPost.styles';

interface PostProps {
  id: number;
  category: string;
  user: string;
  code: string | null;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  imageUrl: string | null;
}

const CommunityPost: React.FC<PostProps> = ({ id, user, category, time, code, title, content, likes, comments, isLiked: serverIsLiked, imageUrl }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. 로컬 상태는 서버에서 내려온 props로 초기화
  const [isLiked, setIsLiked] = useState(serverIsLiked);
  const [currentLikes, setCurrentLikes] = useState(likes);

  // 2. 부모 데이터(리스트 재호출 등)와 동기화
  useEffect(() => {
    setIsLiked(serverIsLiked);
    setCurrentLikes(likes);
  }, [serverIsLiked, likes]);

  // 3. Mutation 설정 
  const mutation = useMutation({
    mutationFn: () => communityApi.toggleLike(id),

    onSuccess: (result) => {
      setIsLiked(result.isLiked);
      setCurrentLikes(result.likeCount);

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['hotPost'] });
    },
    onError: (error: any) => {
      const errorMsg = error.message || '좋아요 처리 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMsg);
    }
  });

  const handlePress = () => {
    router.push({
      pathname: '/community_detail',
      params: { id: String(id) }
    });
  };

  const onLikePress = async () => {
    const token = await getAccessToken();
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
    mutation.mutate();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.profileCircle} />
        <Text style={[styles.userName, Typography.Pretendard_M_14]}>{user}</Text>
        <Text style={[styles.timeText, Typography.Pretendard_M_11]}>{time}</Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.bodyContainer}>
        {/* 왼쪽 텍스트 영역 */}
        <View style={styles.textContent}>
          {/* 제목 */}
          <Text style={[styles.content, Typography.Pretendard_M_14, { marginBottom: 4 }]} numberOfLines={1}>
            {category === 'EXCHANGE' && code ? `(${code}) ` : ''}{title}
          </Text>
          
          {/* 본문 미리보기 (이미지 옆에 위치하므로 2줄 정도로 조절 가능) */}
          <Text
            style={[styles.contentPreview, Typography.Pretendard_M_14, { marginBottom: 0 }]}
            numberOfLines={imageUrl ? 2 : 1} // 이미지가 있으면 2줄, 없으면 1줄
            ellipsizeMode="tail"
          >
            {content}
          </Text>
        </View>

        {/* 오른쪽 썸네일 이미지 영역 (이미지가 있을 때만 노출) */}
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.interactionBox}>
          <TouchableOpacity
            onPress={onLikePress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.6}
            disabled={mutation.isPending}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={16}
              color={isLiked ? "#FFB7C5" : "#888"}
            />
            <Text style={[
              styles.interactionText,
              Typography.Pretendard_M_12,
              isLiked && { color: "#FFB7C5", fontWeight: 'bold' }
            ]}>
              {currentLikes}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            <Ionicons name="chatbubble-outline" size={16} color="#888" style={{ marginLeft: 10 }} />
            <Text style={[styles.interactionText, Typography.Pretendard_M_12]}>{comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CommunityPost;