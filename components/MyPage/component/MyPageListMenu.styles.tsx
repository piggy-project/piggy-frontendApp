import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    width: '100%',
    height: 55,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center', // 텍스트 중앙 배치 (이미지 기준)
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
});