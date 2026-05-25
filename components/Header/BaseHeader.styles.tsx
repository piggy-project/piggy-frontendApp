import { Typography } from '@/constants/Typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  leftArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
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
    gap: 8,
  },

  title: {
    color: '#000',
    ...Typography.Pretendard_M_16,
  },

  wideCenterArea: {
    flex: 3,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  
  shrinkSideArea: {
    flex: 0,
  }
});
