import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 10,
    color: '#333',
  },
  graphWrapper: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 3,
  },
  // 로딩용 스타일
  graphContainer: {
    height: 250,
    backgroundColor: '#E0E0E0', // 로딩 중 회색 박스
    borderRadius: 16,
    marginBottom: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
});