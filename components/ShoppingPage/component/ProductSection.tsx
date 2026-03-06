import { Typography } from '@/constants/Typography';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import FoodCard from './FoodCard';
import ProductCard from './ProductCard';
import { styles } from './ProductSection.styles';


interface ProductSectionProps {
  title: string;
  data: any[];
  type: 'product' | 'food';
}

export default function ProductSection({ title, data, type }: ProductSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_M_16]}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${type}-${index}`}
        renderItem={({ item }) => 
          type === 'product' 
            ? <ProductCard {...item} /> 
            : <FoodCard {...item} />
        }
      />
    </View>
  );
}