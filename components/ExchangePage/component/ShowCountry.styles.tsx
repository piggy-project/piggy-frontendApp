import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerWrapper: {
    backgroundColor: '#fff',
  },
  title: {
    color: "#000000",
    letterSpacing: -0.5,
  },
  filterWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activeTab: {
    backgroundColor: '#3D3D3D',
    borderColor: '#3D3D3D',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inactiveFilterText: {
    color: '#1B1B1B',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  nameText: {
    color: '#868686',
  },
  codeText: {
    color: '#868686',
  },
  subText: {
    color: '#999',
    marginTop: 2,
  },
  rateText: {
    color: '#1B1B1B',
  },
});
