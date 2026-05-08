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
    flexDirection: "row",
    gap: 16,
    paddingBottom: 20,
  },
  destinationCard: {
    width: 200, // 너비를 늘려 설명이 잘 보이게 함
    flexDirection: "column",
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: "#d9d9d9",
  },
  infoWrapper: {
    padding: 10,
    gap: 4,
  },
  destinationLocation: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  reasonText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  });