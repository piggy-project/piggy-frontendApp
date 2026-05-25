import { communityApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ActivityTab = '게시물' | '댓글' | '좋아요';

interface ActivityPost {
  id?: number;
  postId?: number;
  title?: string;
  content?: string;
  category?: string;
  code?: string | null;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
}

interface ActivityComment {
  id?: number;
  postId?: number;
  content?: string;
  createdAt?: string;
  post?: ActivityPost;
  postTitle?: string;
  title?: string;
  likeCount?: number;
}

interface MyActivityResponse {
  posts?: ActivityPost[];
  myPosts?: ActivityPost[];
  comments?: ActivityComment[];
  myComments?: ActivityComment[];
  likedPosts?: ActivityPost[];
  likedPostList?: ActivityPost[];
  likes?: ActivityPost[];
}

const tabs: ActivityTab[] = ['게시물', '댓글', '좋아요'];

const getPostId = (item: ActivityPost | ActivityComment) => {
  if ('post' in item && item.post?.id) return item.post.id;
  return item.postId ?? item.id;
};

const normalizePosts = (data: MyActivityResponse | undefined) => data?.posts ?? data?.myPosts ?? [];
const normalizeComments = (data: MyActivityResponse | undefined) => data?.comments ?? data?.myComments ?? [];
const normalizeLikedPosts = (data: MyActivityResponse | undefined) =>
  data?.likedPosts ?? data?.likedPostList ?? data?.likes ?? [];

export default function UserActivity() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActivityTab>('게시물');

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<MyActivityResponse>({
    queryKey: ['myCommunityActivity'],
    queryFn: communityApi.getMyActivity,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const posts = normalizePosts(data);
  const comments = normalizeComments(data);
  const likedPosts = normalizeLikedPosts(data);

  const openPost = (postId?: number) => {
    if (!postId) return;
    router.push({ pathname: '/community_detail', params: { id: String(postId) } });
  };

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="small" color="#FFB7C5" />
        </View>
      );
    }

    if (isError) {
      return <EmptyState label="활동 정보를 불러오지 못했습니다" />;
    }

    if (activeTab === '게시물') {
      return (
        <ActivityList
          items={posts}
          emptyLabel="작성한 게시물이 없습니다"
          onPress={(item) => openPost(getPostId(item))}
          getTitle={(item) => item.title || item.content || '제목 없음'}
          getPreview={(item) => item.content}
          getCategory={(item) => item.category === 'EXCHANGE' ? item.code : undefined}
          getLikeCount={(item) => item.likeCount}
          getCommentCount={(item) => item.commentCount}
        />
      );
    }

    if (activeTab === '댓글') {
      return (
        <ActivityList
          items={comments}
          emptyLabel="작성한 댓글이 없습니다"
          onPress={(item) => openPost(getPostId(item))}
          getTitle={(item) => item.postTitle || item.post?.title || item.title || '댓글을 단 게시글'}
          getPreview={(item) => item.content}
          getCategory={() => '댓글'}
          getLikeCount={(item) => item.likeCount}
          getCommentCount={() => undefined}
        />
      );
    }

    return (
      <ActivityList
        items={likedPosts}
        emptyLabel="좋아요한 글이 없습니다"
        onPress={(item) => openPost(getPostId(item))}
        getTitle={(item) => item.title || item.content || '제목 없음'}
        getPreview={(item) => item.content}
        getCategory={(item) => item.category === 'EXCHANGE' ? item.code : undefined}
        getLikeCount={(item) => item.likeCount}
        getCommentCount={(item) => item.commentCount}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[Typography.Pretendard_M_14, styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isFetching && data ? (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="small" color="#FFB7C5" />
        </View>
      ) : null}
      {renderContent()}
    </View>
  );
}

function ActivityList<T>({
  items,
  emptyLabel,
  onPress,
  getTitle,
  getPreview,
  getCategory,
  getLikeCount,
  getCommentCount,
}: {
  items: T[];
  emptyLabel: string;
  onPress: (item: T) => void;
  getTitle: (item: T) => string | undefined;
  getPreview: (item: T) => string | undefined;
  getCategory: (item: T) => string | null | undefined;
  getLikeCount: (item: T) => number | undefined;
  getCommentCount: (item: T) => number | undefined;
}) {
  if (items.length === 0) return <EmptyState label={emptyLabel} />;

  return (
    <View style={styles.list}>
      {items.map((item, index) => {
        const category = getCategory(item);
        const likeCount = getLikeCount(item);
        const commentCount = getCommentCount(item);

        return (
          <TouchableOpacity
            key={`${getTitle(item) ?? 'activity'}-${index}`}
            style={styles.postRow}
            activeOpacity={0.7}
            onPress={() => onPress(item)}
          >
            <View style={styles.postTextArea}>
              <View style={styles.titleRow}>
                {category ? (
                  <Text style={[styles.codeText, Typography.Pretendard_M_11]}>{category}</Text>
                ) : null}
                <Text style={[styles.postTitle, Typography.Pretendard_M_14]} numberOfLines={1}>
                  {getTitle(item) || '제목 없음'}
                </Text>
              </View>
              {getPreview(item) ? (
                <Text style={[styles.postPreview, Typography.Pretendard_M_12]} numberOfLines={1}>
                  {getPreview(item)}
                </Text>
              ) : null}
            </View>

            {(likeCount !== undefined || commentCount !== undefined) && (
              <View style={styles.statsPill}>
                {likeCount !== undefined && (
                  <>
                    <Ionicons name="thumbs-up-outline" size={12} color="#6E6E73" />
                    <Text style={styles.statText}>{likeCount}</Text>
                  </>
                )}
                {commentCount !== undefined && (
                  <>
                    <Ionicons
                      name="chatbubble-outline"
                      size={12}
                      color="#6E6E73"
                      style={likeCount !== undefined ? styles.commentIcon : undefined}
                    />
                    <Text style={styles.statText}>{commentCount}</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.centerContent}>
      <Text style={[styles.emptyText, Typography.Pretendard_M_14]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#1F2933',
  },
  tabText: {
    color: '#555555',
  },
  activeTabText: {
    color: '#111111',
  },
  list: {
    paddingHorizontal: 16,
  },
  refreshIndicator: {
    paddingTop: 8,
    alignItems: 'center',
  },
  postRow: {
    minHeight: 62,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF4',
    justifyContent: 'space-between',
  },
  postTextArea: {
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    marginRight: 6,
    color: '#FF7088',
  },
  postTitle: {
    flex: 1,
    color: '#222222',
  },
  postPreview: {
    marginTop: 3,
    color: '#8E8E93',
  },
  statsPill: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  commentIcon: {
    marginLeft: 8,
  },
  statText: {
    marginLeft: 3,
    color: '#6E6E73',
    fontSize: 10,
    lineHeight: 13,
  },
  centerContent: {
    paddingVertical: 34,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999999',
  },
});
