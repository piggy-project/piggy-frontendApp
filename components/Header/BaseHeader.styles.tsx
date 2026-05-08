import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    minHeight: 60,
    paddingBottom: 10,
    backgroundColor: '#fff', // 헤더 흰색 유지
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },

  leftArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },

});
