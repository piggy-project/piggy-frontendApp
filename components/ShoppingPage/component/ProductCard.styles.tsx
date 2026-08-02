import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: 12,
  },
  imageWrapper: {
    width: 110,
    height: 110,
    marginBottom: 8,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#EBEBEB',
  },
  favoriteButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#333',
    marginBottom: 2,
    fontSize: 12,
  },
  priceMain: {
    color: '#000',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    color: '#FF4D4D',
    fontWeight: '700',
  },
  subText: {
    color: '#888',
    fontSize: 11,
  },
  strike: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
});
