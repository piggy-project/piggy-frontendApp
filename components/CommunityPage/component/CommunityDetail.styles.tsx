import { StyleSheet } from 'react-native';

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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  categoryBadge: {
    backgroundColor: '#FFF9E5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFD700',
  },
  title: {
    color: '#333',
    marginBottom: 20,
    lineHeight: 30,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  authorName: {
    color: '#333',
  },
  dateText: {
    color: '#999',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  content: {
    color: '#444',
    lineHeight: 26,
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  interactionText: {
    marginLeft: 6,
    color: '#888',
  },
  activeInteractionText: {
    color: '#FFB7C5',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF5F5', 
    borderWidth: 1,
    borderColor: '#FFEAEA',
    marginLeft: 'auto'
  },
  deleteText: {
    color: '#FF5252',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  // ───── 댓글 섹션 ─────
  commentSection: {
    paddingBottom: 10,
  },
  commentTitle: {
    color: '#333',
    marginBottom: 12,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentProfileCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE4EA',
    marginRight: 8,
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthorName: {
    color: '#333',
  },
  commentDate: {
    color: '#aaa',
    marginTop: 1,
  },
  commentDeleteButton: {
    padding: 4,
  },
  commentContent: {
    color: '#444',
    lineHeight: 20,
    paddingLeft: 36,
  },
  emptyComment: {
    color: '#aaa',
    textAlign: 'center',
    paddingVertical: 24,
  },

  // ───── 댓글 입력창 ─────
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  commentSubmitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB7C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSubmitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});