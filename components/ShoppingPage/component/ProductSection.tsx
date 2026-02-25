import { Typography } from '@/constants/Typography';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ProductCard from './ProductCard';
import { styles } from './ProductSection.styles';

interface ProductSectionProps {
  title: string;
  data: any[];
}

export default function ProductSection({ title, data }: ProductSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_M_16]}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard {...item} />}
      />
    </View>
  );
}