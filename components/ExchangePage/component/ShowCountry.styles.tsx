import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff', // 스티키 효과를 위해 배경색 필수
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activeTab: {
    backgroundColor: '#FFD700', // Piggys 포인트 컬러
    borderColor: '#FFD700',
  },
  activeFilterText: {
    color: '#000',
    fontWeight: 'bold',
  },
  inactiveFilterText: {
    color: '#888',
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
    color: '#333',
  },
  codeText: {
    color: '#666',
  },
  subText: {
    color: '#999',
    marginTop: 2,
  },
  rateText: {
    color: '#333',
  },
});