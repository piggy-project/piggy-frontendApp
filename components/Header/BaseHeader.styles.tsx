import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    minHeight: 60,
    paddingBottom: 12,
    backgroundColor: '#fff', // 헤더 흰색 유지
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20, 
  },

  leftArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  rightArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },

});
