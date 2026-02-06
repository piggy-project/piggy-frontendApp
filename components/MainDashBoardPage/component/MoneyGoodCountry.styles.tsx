import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1.8,
    backgroundColor: '#FF0000',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.07,
  },
});
