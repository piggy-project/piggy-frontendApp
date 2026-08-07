import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchModeScreen: {
  flex: 1,
  backgroundColor: '#fff',
},
searchResultBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 12,
  backgroundColor: '#F5F5F5',
  marginBottom: 8,
},
searchResultText: {
  flex: 1,
  fontSize: 14,
  fontWeight: '600',
  color: '#222',
  marginRight: 8,
},
searchResultClear: {
  fontSize: 13,
  color: '#FFB7C5',
  fontWeight: '600',
},
});