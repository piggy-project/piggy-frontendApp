import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  name: string;
  discount: string;
  priceKrw: string;
  localPrice: string;
  originalPrice: string;
}

export default function ProductCard({ name, discount, priceKrw, localPrice, originalPrice }: ProductCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <Text style={[styles.name, Typography.Pretendard_M_12]}>{name}</Text>
      <Text style={[styles.priceMain, Typography.Pretendard_B_16]}>
        <Text style={[styles.discountText, Typography.Pretendard_B_16]}>{discount} </Text>{priceKrw}
      </Text>
      <Text style={[styles.subText, Typography.Pretendard_M_11]}>{localPrice}</Text>
      <Text style={[styles.subText, Typography.Pretendard_M_11, styles.strike]}>{originalPrice}</Text>
    </View>
  );
}