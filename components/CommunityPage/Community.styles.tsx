import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  

  // 위젯들 사이의 간격을 벌려주는 역할
  sectionGap: {
    gap: 20, // 아이템들 사이에 20px씩 간격 자동 생성
  }
});