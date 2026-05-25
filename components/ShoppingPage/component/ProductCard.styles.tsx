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
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    color: '#333',
    marginBottom: 2,
  },
  priceMain: {
    color: '#000',
    marginBottom: 2,
  },
  discountText: {
    color: '#000', // 이미지상 검정색 강조
  },
  subText: {
    color: '#888',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
});
