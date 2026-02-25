import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabItem: {
    width: width / 5, // 5등분 스타일 유지
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTabItem: {
    borderBottomColor: '#333', // 선택 시 밑줄 강조
  },
  text: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  selectedText: {
    color: '#333',
    fontWeight: 'bold',
  },
  // --- 드롭다운 모달 스타일 추가 ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
  },
  dropdownContainer: {
    marginTop: 110, // 탭 바 위치에 맞춰 적절히 조절
    alignSelf: 'flex-end',
    marginRight: 20,
    width: 140,
    maxHeight: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dropdownText: {
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
});