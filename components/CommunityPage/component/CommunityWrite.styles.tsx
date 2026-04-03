import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 상단 헤더 스타일 (뒤로가기 + 완료 버튼)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20, // 상태표시줄 고려
    paddingBottom: 15,
    backgroundColor: '#FFF',
  },
  completeText: {
    color: '#000', // 사진처럼 검은색 혹은 포인트 컬러
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // 게시판 선택 칩 컨테이너
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 25,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F5F5F5', // 비활성 배경
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: '#444', // 활성 배경 (사진의 어두운색)
  },
  chipText: {
    color: '#888', // 비활성 글자색
  },
  activeChipText: {
    color: '#FFF', // 활성 글자색
  },

  // 국가 선택 섹션 (환율게시판용)
  currencySection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  subLabel: {
    color: '#AAA',
    marginBottom: 10,
    fontSize: 12,
  },
  currencyScroll: {
    flexDirection: 'row',
  },
  currencyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  activeCurrencyBadge: {
    backgroundColor: '#FFB7C5', // Piggys 핑크 포인트
    borderColor: '#FFB7C5',
  },

  // 입력 필드 스타일
  titleInput: {
    paddingVertical: 15,
    color: '#333',
    // Typography.Pretendard_B_20 등을 적용할 것이므로 기본적인 여백만 설정
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  contentInput: {
    minHeight: 350,
    color: '#333',
    lineHeight: 24,
    textAlignVertical: 'top', // 안드로이드 상단 정렬 필수
  },

  // 하단 푸터 (이미지 아이콘 등)
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFF',
    paddingBottom: Platform.OS === 'ios' ? 34 : 15,
  },

  // 기존에 쓰던 버튼 스타일 유지 (필요 시)
  submitButton: {
    backgroundColor: '#FFB7C5',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
  imagePreviewContainer: {
    marginVertical: 10,
    position: 'relative',
    width: 200,
    height: 150,
},
imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
},
imageDeleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
},
});