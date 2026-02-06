import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1.3,
    backgroundColor: '#00FFFF',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
});
