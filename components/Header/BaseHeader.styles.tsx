import { StyleSheet } from 'react-native';
import { Typography } from '@/constants/Typography';

export const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },

  leftArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 8,
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
    alignItems: 'flex-end',
    gap: 12,
  },

  title: {
    color: '#000',
    ...Typography.Pretendard_M_16,
  },

  // For cases like CommunityHeader that needs a wider center
  wideCenterArea: {
    flex: 3,
    alignItems: 'stretch',
  },
  
  shrinkSideArea: {
    flex: 0,
  }
});
