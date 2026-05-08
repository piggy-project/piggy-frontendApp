import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    // 박스 자체가 화면 끝까지 길게 늘어나도록 설정
    height: height, 
    
    // 그림자 강조
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 25,
  },
  
  // 1. 환율 정보 바 스타일
  rateInfoBar: {
    backgroundColor: '#E0E0E0', // 연한 회색 배경
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rateText: {
    color: '#333',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryName: {
    color: '#333',
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DA251D', // 기본 배경색
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 2. 그래프 영역 스타일
  graphArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
