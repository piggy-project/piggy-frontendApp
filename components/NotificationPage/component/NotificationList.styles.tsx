import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center', // 수직 중앙 정렬
    paddingVertical: 15,
  },
  // 왼쪽 원형 아이콘 스타일
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23, // 반지름 (지름의 절반)
    backgroundColor: '#D9D9D9', // 회색 배경
    marginRight: 15,
  },
  textContainer: {
    flex: 1, // 남은 공간 모두 차지
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600', // 약간 굵게
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#888', // 연한 회색
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0', // 아주 연한 구분선
    width: '100%',
  },
});