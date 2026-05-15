import { communityApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './CommunityDetail.styles';

export default function CommunityDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // 수정 핸들러
  const handleEdit = () => {
    setIsMenuVisible(false); // 메뉴 닫기
    router.push({
      pathname: '/community_edit',
      params: { id: String(id) }
    });
  };

  // 삭제 핸들러 (기존 handleDelete 활용)
  const confirmDelete = () => {
    setIsMenuVisible(false);
    handleDelete();
  };

  // 1. 상세 데이터 조회 부분
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', Number(id)],
    queryFn: async () => {
      const result = await communityApi.getPostDetail(Number(id));
      return result;
    },
    enabled: !!id && !isNaN(Number(id)),
  });

  // 현재 실시간 1위 인기글 조회
  const { data: topHotPost } = useQuery({
    queryKey: ['topHotPost'],
    queryFn: () => communityApi.getTopHotPost(),
  });

  // 2. 댓글 목록 조회 부분
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', Number(id)],
    queryFn: () => communityApi.getComments(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  });

  const isHotPost = topHotPost?.id === Number(id);

  // 좋아요 처리 (useMutation)
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
    likeMutation.mutate();
  };
  // 게시물 삭제 처리
  const deleteMutation = useMutation({
    mutationFn: () => communityApi.deletePost(Number(id)),
    onSuccess: () => {
      Alert.alert('성공', '게시글이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // 목록 갱신
      router.back(); // 이전 화면으로 이동
    },
    onError: (error: any) => {
      Alert.alert('오류', error.message || '삭제 중 오류가 발생했습니다.');
    }
  });

  // 삭제 확인 핸들러
  const handleDelete = () => {
    Alert.alert('게시글 삭제', '정말로 이 게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  };

  // 댓글 작성 핸들러
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => communityApi.createComment(Number(id), content),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['post', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['hotPost'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      Alert.alert('오류', error.message || '댓글 작성 중 오류가 발생했습니다.');
    },
  })

  // 댓글 작성 핸들러
  const handleCreateComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }
    const token = await getAccessToken();
    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인하러 가기', onPress: () => router.push('/login') },
        ]
      );
      return;
    }
    createCommentMutation.mutate(commentText.trim());
  };

  // 댓글 삭제 (useMutation)
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => communityApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['post', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['hotPost'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      Alert.alert('오류', error.message || '댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  // 댓글 삭제 확인 핸들러
  const handleDeleteComment = (commentId: number) => {
    Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteCommentMutation.mutate(commentId),
      },
    ]);
  };

  if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FFB7C5" /></View>;
  if (!post) return <View style={styles.errorContainer}><Text>게시글을 찾을 수 없습니다.</Text></View>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        {post.isAuthor && (
          <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        {/* 배경 클릭 시 닫기 */}
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuVisible(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuOption} onPress={handleEdit}>
              <Text style={styles.menuOptionText}>수정</Text>
            </TouchableOpacity>
            
            <View style={styles.menuSeparator} />
            
            <TouchableOpacity style={styles.menuOption} onPress={confirmDelete}>
              <Text style={styles.menuOptionText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.postContentWrapper}>
          {/* 상단 배지 영역 */}
          <View style={styles.badgeRow}>
            {isHotPost && (
              <View style={styles.hotBadge}>
                <Text style={styles.hotBadgeText}>인기글</Text>
              </View>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {post.category === 'EXCHANGE' ? `환율게시판(${post.code})` :
                  post.category === 'FREE' ? '자유게시판' : '여행게시판'}
              </Text>
            </View>
          </View>

          {/* 작성자 정보 */}
          <View style={styles.authorSection}>
            <View style={styles.authorInfo}>
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={16} color="#FFB7C5" />
              </View>
              <Text style={[Typography.Pretendard_B_16, styles.authorNickname]}>
                {post.authorNickname}
              </Text>
            </View>
            <View style={styles.dividerLight} />
          </View>

          {/* 본문 */}
          <Text style={[Typography.Pretendard_B_24, styles.title]}>{post.title}</Text>
          <Text style={[Typography.Pretendard_M_16, styles.content]}>{post.content}</Text>

          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
        </View>
        {/* 하단 메타 정보 & 좋아요/댓글 수 */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {formatDate(post.createdAt)}  ·  조회수 {post.viewCount}
          </Text>
          <View style={styles.interactionRow}>
            <TouchableOpacity onPress={handleLike} style={styles.statItem}>
              <Ionicons name="thumbs-up-outline" size={16} color={post.isLiked ? "#FFB7C5" : "#888"} />
              <Text style={[styles.statText, post.isLiked && { color: '#FFB7C5' }]}>{post.likeCount}</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#888" />
              <Text style={styles.statText}>{comments.length}</Text>
            </View>
          </View>
        </View>

        {/* 댓글 섹션  */}
        <View style={styles.commentSection}>
          <Text style={[Typography.Pretendard_B_16, styles.commentCountTitle]}>댓글 {comments.length}</Text>

          {comments.map((comment: any) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.authorInfoSmall}>
                  <View style={styles.profilePlaceholderSmall}>
                    <Ionicons name="person" size={10} color="#FFB7C5" />
                  </View>
                  <Text style={styles.commentAuthor}>{comment.authorNickname}</Text>
                  <Text style={styles.commentTime}> · {formatTime(comment.createdAt)}</Text>
                </View>

                {/* 작성자일 때만 우측에 삭제 버튼 노출 */}
                {comment.isAuthor && (
                  <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                    <Ionicons name="trash-outline" size={14} color="#FF5252" />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.commentBody}>{comment.content}</Text>

              <View style={styles.commentStats}>
                <View style={styles.statItemSmall}>
                  <Ionicons name="thumbs-up-outline" size={12} color="#888" />
                  <Text style={styles.statTextSmall}>0</Text>
                </View>
                <View style={styles.statItemSmall}>
                  <Ionicons name="chatbubble-outline" size={12} color="#888" />
                  <Text style={styles.statTextSmall}>0</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 댓글 입력창 */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handleCreateComment}>
            <Ionicons name="send" size={20} color="#444" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// 시간 포맷팅 헬퍼
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 연/월/일 형식을 0000/00/00으로 맞춰주는 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // 월과 일은 10보다 작으면 앞에 0을 붙여줍니다 (padStart 이용)
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};