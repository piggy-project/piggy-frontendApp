import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#000',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#E0E0E0', // 연한 회색 배경
    borderRadius: 10,           // 둥근 모서리
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,           // 카드 간 간격
  },
  label: {
    color: '#666',              // 라벨은 약간 흐리게
    marginBottom: 5,
  },
  valueContainer: {
    flexDirection: 'row',       // 값과 변동폭을 가로로 배치
    alignItems: 'baseline',     // 텍스트 밑줄 기준 정렬
  },
  value: {
    color: '#000',
  },
  changeText: {
    marginLeft: 8,              // 숫자 옆에 약간 띄우기
  },
  textUp: {
    color: '#FF3B30', // 상승: 빨간색 (iOS 시스템 레드 계열)
  },
  textDown: {
    color: '#007AFF', // 하락: 파란색 (iOS 시스템 블루 계열)
  },
  textNeutral: {
    color: '#333333', // 변동 없음: 진한 회색
  }
});