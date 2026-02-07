import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff', // 배경색
  },
  input: {
    backgroundColor: '#E0E0E0', // 회색 배경 (스크린샷 참고)
    borderRadius: 20, // 둥근 모서리
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
});