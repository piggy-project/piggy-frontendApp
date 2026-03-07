import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  cancelText: {
    color: '#999',
  },
  submitText: {
    color: '#FFB7C5', // 핑크 포인트
  },
  scrollContainer: {
    padding: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryLabel: {
    color: '#666',
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#FFF9E5', // 연한 노란색 배경
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  categoryText: {
    color: '#FFD700',
  },
  titleInput: {
    paddingVertical: 10,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  contentInput: {
    minHeight: 300,
    color: '#333',
    lineHeight: 24,
  },
  bottomButtonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // iOS 하단 바 고려
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#FFB7C5', // Piggys 핑크 포인트
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // 버튼 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
});