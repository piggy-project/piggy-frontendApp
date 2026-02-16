import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {

  },
  background: {
    width: '100%',
    height: 400,
    justifyContent: 'space-between', // 내부 요소 상-하 배치 분배
    paddingVertical: 20,
    backgroundColor: '#E0E0E0', // 이미지가 없을 때 보일 회색 배경색
  },
  textContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 32, // 줄 간격
  },
  targetRateButton: {
    alignSelf: 'flex-start', // 왼쪽 정렬 (flex-start) 또는 글자 크기에 맞춤
    backgroundColor: '#fff',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20, // 둥근 캡슐 모양
    flexDirection: 'row', // 글자와 아이콘 가로 배치
    alignItems: 'center',
    
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  targetRateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
