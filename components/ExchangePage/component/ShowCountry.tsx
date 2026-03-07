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
  percentChange: number;
  flag: string; // 이모지 사용 (나중에 이미지로 교체 가능)
}
interface ShowCountryProps {
  data: CountryData[];
  onPressItem: (item: CountryData) => void;
  onFilterChange: (sort: string) => void;
  activeFilter: string;
}
// 필터 옵션 정의
const FILTERS = [
  { label: '급상승', value: 'RISE' },
  { label: '급하락', value: 'FALL' },
  { label: '높은순', value: 'HIGH' },
  { label: '낮은순', value: 'LOW' },
];

export default function ShowCountry({ data, onPressItem, onFilterChange, activeFilter }: ShowCountryProps) {
  const handleFilterPress = (sortValue: string) => {
    onFilterChange(sortValue);
  };

  const renderHeader = () => (
    <View style={styles.filterWrapper}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterTab, 
            activeFilter === filter.value && styles.activeTab // 부모가 준 값으로 비교
          ]}
          onPress={() => handleFilterPress(filter.value)}
        >
          <Text style={[
            Typography.Pretendard_M_12,
            activeFilter === filter.value ? styles.activeFilterText : styles.inactiveFilterText
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={renderHeader}
      stickyHeaderIndices={[0]} // 필터 상단 고정
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => onPressItem(item)}>
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

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.rateText, Typography.Pretendard_M_14]}>{item.rate}</Text>
            {/* 변동률 표시 섹션 */}
            <Text style={[
              Typography.Pretendard_M_12, 
              { color: item.percentChange >= 0 ? '#FF4500' : '#007AFF', marginTop: 2 }
            ]}>
              {item.percentChange >= 0 ? '▲' : '▼'} {Math.abs(item.percentChange).toFixed(2)}%
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}