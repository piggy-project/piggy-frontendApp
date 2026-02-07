import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    justifyContent: 'space-between',
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
