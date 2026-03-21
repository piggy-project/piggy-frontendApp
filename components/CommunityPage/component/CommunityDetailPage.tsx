import NoneHeader from '@/components/Header/NoneHeader';
import { communityApi } from '@/components/utils/api';
import { getToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './CommunityDetail.styles';

export default function CommunityDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  // 1. 상세 데이터 조회 부분
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', Number(id)],
    queryFn: async () => {
      const result = await communityApi.getPostDetail(Number(id));
      return result;
    },
    enabled: !!id && !isNaN(Number(id)),
  });

  // 2. 댓글 목록 조회 부분
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', Number(id)],
    queryFn: () => communityApi.getComments(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  });

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
    const token = await getToken();
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
              name={post.isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={22}
              color={post.isLiked ? '#FFB7C5' : '#888'}
            />
            <Text
              style={[
                styles.interactionText,
                post.isLiked && { color: '#FFB7C5', fontWeight: 'bold' },
              ]}
            >
              {post.likeCount}
            </Text>
          </TouchableOpacity>

          {/* 삭제 버튼: 작성자일 때만 노출 */}
          {post.isAuthor && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
              disabled={deleteMutation.isPending}
            >
              <Ionicons name="trash-outline" size={18} color="#FF5252" />
              <Text style={styles.deleteText}>삭제</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {/* 댓글 섹션 */}
        <View style={styles.commentSection}>
          <Text style={[Typography.Pretendard_B_16, styles.commentTitle]}>
            댓글 {comments.length}
          </Text>

          {/* 댓글 목록 */}
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentProfileCircle} />
                  <View style={styles.commentAuthorInfo}>
                    <Text style={[Typography.Pretendard_B_16, styles.commentAuthorName]}>
                      {comment.authorNickname}
                    </Text>
                    <Text style={[Typography.Pretendard_M_12, styles.commentDate]}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {/* 댓글 삭제 버튼: 작성자일 때만 노출 */}
                  {comment.isAuthor && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(comment.id)}
                      style={styles.commentDeleteButton}
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Ionicons name="trash-outline" size={15} color="#FF5252" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[Typography.Pretendard_M_14, styles.commentContent]}>
                  {comment.content}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[Typography.Pretendard_M_14, styles.emptyComment]}>
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* 댓글 입력창 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          placeholderTextColor="#aaa"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.commentSubmitButton,
            (!commentText.trim() || createCommentMutation.isPending) && styles.commentSubmitButtonDisabled,
          ]}
          onPress={handleCreateComment}
          disabled={!commentText.trim() || createCommentMutation.isPending}
          activeOpacity={0.7}
        >
          {createCommentMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}