import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 44,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentRate: {
    color: '#222222',
    flexShrink: 0,
  },
  changeText: {
    marginLeft: 8,
    flexShrink: 1,
  },
  heartButton: {
    width: 34,
    height: 28,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
