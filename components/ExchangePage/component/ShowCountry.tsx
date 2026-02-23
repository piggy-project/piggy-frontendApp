import { Typography } from '@/constants/Typography';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShowCountry.styles';

// 국가 데이터 타입 정의
export interface CountryData {
  id: string;
  name: string; // 예: 미국
  code: string; // 예: USD
  rate: string; // 예: 1,460.10 KRW
  flag: string; // 이모지 사용 (나중에 이미지로 교체 가능)
}
interface ShowCountryProps {
  data: CountryData[];
  onPressItem: (item: CountryData) => void;
}

export default function ShowCountry({ data, onPressItem }: ShowCountryProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => onPressItem(item)}
          activeOpacity={0.7}
        >
          <View style={styles.leftSection}>
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>{item.flag}</Text>
            </View>
            <View>
              <Text style={[styles.nameText, Typography.Pretendard_M_14]}>
                {item.name} <Text style={styles.codeText}>({item.code})</Text>
              </Text>
              <Text style={[styles.subText, Typography.Pretendard_M_12]}>
                {item.code === 'JPY' ? '100' : '1'} {item.code}
              </Text>
            </View>
          </View>
          <View>
            <Text style={[styles.rateText, Typography.Pretendard_M_14]}>{item.rate}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}