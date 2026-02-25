import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#000000",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  cardContainer: {
    flexDirection: "row", // 가로 배치를 위해 필요
    gap: 12,
  },
  destinationCard: {
    width: 110, // 고정 너비 설정
    flexDirection: "column",
    gap: 8,
  },
  imagePlaceholder: {
    width: 110,
    height: 140,
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    overflow: "hidden", // 이미지가 border-radius를 넘지 않도록 설정
  },
  destinationName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
  },
});