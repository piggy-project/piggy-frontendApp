import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 10, // 드롭다운이 게시글 리스트를 덮도록 함
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    height: 50, // 명시적인 높이를 주는 것이 레이아웃 꼬임을 방지함
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // 드롭다운 absolute 배치의 기준점
  },
  tab: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  tabText: {
    color: '#888',
  },
  activeTabText: {
    color: '#000',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50, 
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    width: 140, // 이름을 보여주기 위해 너비 확장 (80 -> 140)
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // ScrollView의 둥근 모서리 적용을 위해
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12, // 좌우 여백 추가
    alignItems: 'flex-start', // 텍스트가 기니까 왼쪽 정렬이 보기 좋음
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
});