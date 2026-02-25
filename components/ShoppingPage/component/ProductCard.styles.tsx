import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    marginBottom: 8,
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