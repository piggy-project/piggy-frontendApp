import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', // 회색에서 흰색으로 변경
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    // 그림자 추가 (선택사항, 가독성을 위해)
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  defaultProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // 아이콘일 때의 배경색
    borderWidth: 1,
    borderColor: '#eee',
  },
  userName: {
    flex: 1,
  },
  timeText: {
    color: '#666',
  },
  contentPreview: {
    color: '#666', // 본문은 제목보다 조금 더 연한 색으로

  },
  divider: {
    height: 1,
    backgroundColor: '#C9C9C9',
    marginBottom: 10,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // 왼쪽 텍스트 영역
  textContent: {
    flex: 1, // 남은 공간 모두 차지
  },
  // 오른쪽 작은 이미지 (썸네일)
  thumbnail: {
    width: 70, // 작게 설정
    height: 70,
    borderRadius: 8,
    marginLeft: 16, // 텍스트와의 간격 확보 (오른쪽으로 밀기)
    backgroundColor: '#f5f5f5', // 로딩 전 배경색
  },
  content: {
    color: '#000',
    minHeight: 20,
  },
  countryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryBadgeText: {
    color: '#999',
  },
  footer: {
    alignItems: 'flex-end',
  },
  interactionBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // 카드가 흰색이 되었으므로, 박스는 연회색으로 변경
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  interactionText: {
    color: '#888',
    marginLeft: 5,
  },
});