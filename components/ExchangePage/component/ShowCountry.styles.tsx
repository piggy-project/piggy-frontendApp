import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // 리스트 구분선
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  flag: {
    fontSize: 24,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  codeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  subText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});