import { Typography } from '@/constants/Typography';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  image: string;  
  name: string;
  discount?: string;
  priceKrw: string;
  localPrice: string;
  originalPrice?: string;
}

export default function ProductCard({ image, name, discount, priceKrw, localPrice, originalPrice }: ProductCardProps) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={[styles.name, Typography.Pretendard_M_12]}>{name}</Text>
      <Text style={[styles.priceMain, Typography.Pretendard_B_16]}>
        {/* discount가 있을 때만 렌더링 */}
        {discount && <Text style={[styles.discountText, Typography.Pretendard_B_16]}>{discount} </Text>}
        {priceKrw}
      </Text>
      <Text style={[styles.subText, Typography.Pretendard_M_11]}>{localPrice}</Text>
      {/* originalPrice가 있을 때만 렌더링 */}
      {originalPrice && (
        <Text style={[styles.subText, Typography.Pretendard_M_11, styles.strike]}>{originalPrice}</Text>
      )}
    </View>
  );
}