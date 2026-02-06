import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: '#00FF00',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    marginBottom: height * 0.01,
  },
});
