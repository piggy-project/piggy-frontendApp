import { Dimensions, StyleSheet } from "react-native";

// 화면 너비 가져오기
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabItem: {
    width: width / 5,      // ✅ [핵심] 아이템 하나당 화면의 1/4 크기 고정 (약 90~100px)
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTabItem: {
    borderBottomColor: '#333', // 선택 시 검은색 밑줄
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
});