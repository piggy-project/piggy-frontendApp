import { Typography } from '@/constants/Typography';
import { FlatList, Text, useWindowDimensions, View } from 'react-native';
import FoodCard from './FoodCard';
import ProductCard from './ProductCard';
import { styles } from './ProductSection.styles';


interface ProductSectionProps {
  title: string;
  data: any[];
  type: 'product' | 'food';
  layout?: 'horizontal' | 'grid';
}

export default function ProductSection({ title, data, type, layout = 'horizontal' }: ProductSectionProps) {
  const { width } = useWindowDimensions();
  const gridGap = 16;
  const gridCardWidth = Math.floor((width - 40 - gridGap) / 2);

  if (layout === 'grid') {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, Typography.Pretendard_M_16]}>{title}</Text>
        <View style={[styles.gridList, { columnGap: gridGap }]}>
          {data.map((item, index) => (
            <ProductCard
              key={`${type}-grid-${item.id || item.externalProductId || index}`}
              {...item}
              cardWidth={gridCardWidth}
            />
          ))}
        </View>
      </View>
    );
  }

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
