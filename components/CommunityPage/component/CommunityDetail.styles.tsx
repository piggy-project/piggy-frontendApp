import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContentWrapper: {
    paddingHorizontal: 20, // 기존에 scrollContent가 가졌던 패딩을 일로 옮깁니다.
    paddingTop: 20,
  },

  // ───── 배지(Badge) 섹션 ─────
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  hotBadge: {
    backgroundColor: '#FFB7C5', // 인기글 핑크색
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  hotBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: '#D1D1D1', // 카테고리 회색
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  // ───── 작성자 정보 섹션 ─────
  authorSection: {
    marginBottom: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorNickname: {
    color: '#333',
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F2F2F2',
  },

  // ───── 본문 ─────
  title: {
    color: '#000',
    marginBottom: 15,
  },
  content: {
    color: '#444',
    lineHeight: 24,
    marginBottom: 20
  },
  postImage: {
    width: '100%',
    height: 300, // 고정 높이를 주거나 비율에 맞게 조정 가능
    borderRadius: 12,
    backgroundColor: '#f5f5f5', // 로딩 전이나 빈 공간일 때 보일 배경색
    marginBottom: 20,

  },

  // ───── 하단 메타 정보 & 통계 ─────
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#F2F2F2', // 사진처럼 굵은 구분선
    paddingHorizontal: 20,
  },
  metaText: {
    color: '#888',
    fontSize: 13,
  },
  interactionRow: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    marginLeft: 4,
    color: '#888',
    fontSize: 14,
  },

  // ───── 댓글 섹션 (카드 스타일) ─────
  commentSection: {
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F2F2F2', // 사진처럼 전체 배경을 회색으로
    minHeight: 500, // 댓글이 없을 때도 배경색이 유지되도록 설정
  },
  commentCountTitle: {
    color: '#333',
    marginBottom: 20,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  authorInfoSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePlaceholderSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },
  commentTime: {
    fontSize: 12,
    color: '#AAA',
  },
  commentBody: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  commentStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  statTextSmall: {
    marginLeft: 3,
    color: '#888',
    fontSize: 12,
  },
  commentDeleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
  },

  // ───── 하단 댓글 입력창 ─────
  inputWrapper: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false, // 안드로이드 전용 폰트 여백 제거
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
  },
  deleteText: {
    color: '#FF5252',
    fontSize: 12,
    marginLeft: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 양끝 정렬!
    alignItems: 'center',
    marginBottom: 8,
  },
});