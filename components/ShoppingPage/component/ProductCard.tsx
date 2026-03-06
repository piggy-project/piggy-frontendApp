import { Typography } from '@/constants/Typography';
import React from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  id: string;
  image: string;  
  name: string;
  discount?: string;
  priceKrw: string;
  localPrice: string;
  originalPrice?: string;
}

export default function ProductCard({ 
  id,
  image, 
  name, 
  discount, 
  priceKrw, 
  localPrice, 
  originalPrice 
}: ProductCardProps) {

  // 클릭 시 링크로 이동하는 핸들러
  const handlePress = async () => {
    if (!id || !id.startsWith('http')) {
      Alert.alert("알림", "연결 가능한 상품 페이지가 없습니다.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(id);
      if (supported) {
        await Linking.openURL(id);
      } else {
        Alert.alert("알림", "이 링크를 열 수 있는 앱이 없습니다.");
      }
    } catch (error) {
      console.error("링크 오픈 에러:", error);
      Alert.alert("에러", "페이지를 여는 중 문제가 발생했습니다.");
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress} 
      activeOpacity={0.8}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      
      <Text style={[styles.name, Typography.Pretendard_M_12]} numberOfLines={2}>
        {name}
      </Text>
      
      <Text style={[styles.priceMain, Typography.Pretendard_B_16]}>
        {discount && <Text style={[styles.discountText, Typography.Pretendard_B_16]}>{discount} </Text>}
        {priceKrw}
      </Text>
      
      <Text style={[styles.subText, Typography.Pretendard_M_11]}>{localPrice}</Text>
      
      {originalPrice && (
        <Text style={[styles.subText, Typography.Pretendard_M_11, styles.strike]}>
          {originalPrice}
        </Text>
      )}
    </TouchableOpacity>
  );
}