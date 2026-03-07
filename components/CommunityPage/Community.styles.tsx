import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionGap: {
    gap: 0, // 아이템들 사이에 20px씩 간격 자동 생성
  },
  fab: {
    position: 'absolute',
    bottom: 30, // 하단 여백
    right: 20,  // 우측 여백
    backgroundColor: '#FFB7C5', // Piggys 커뮤니티 포인트 핑크색
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30, // 둥근 모양
    // 안드로이드 그림자
    elevation: 8,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});