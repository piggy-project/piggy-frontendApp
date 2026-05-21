import { FLAG_ICON_MAP } from '@/constants/Currency';
import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShowCountry.styles';

// 국가 데이터 타입 정의
export interface CountryData {
  id: string;
  name: string; // 예: 미국
  code: string; // 예: USD
  apiCode: string;
  rate: string; // 예: 1,460.10 KRW
  percentChange: number;
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
    <View style={styles.headerWrapper}>
      <Text style={[styles.title, Typography.Pretendard_M_16]}>해시태그별 여행지</Text>
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
    </View>
  );

  return (
    <View style={styles.listContainer}>
      {renderHeader()}
      {data.map((item) => {
        const FlagIcon = FLAG_ICON_MAP[item.code];

        const numericRate = parseFloat(item.rate.replace(/,/g, ''));
        const calculatedChange = isNaN(numericRate)
          ? 0
          : numericRate * (item.percentChange / (100 + item.percentChange));

        const isUp = item.percentChange > 0;
        const isDown = item.percentChange < 0;

        const statusColor = isUp ? '#FF3B30' : isDown ? '#007AFF' : '#8E8E93';
        const statusSign = isUp ? '+' : isDown ? '-' : '';
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => onPressItem(item)}
          >
            <View style={styles.leftSection}>
              <View style={styles.flagContainer}>
                {FlagIcon && <FlagIcon width={40} height={40} />}
              </View>
              <View>
                <Text style={[styles.nameText, Typography.Pretendard_M_14]}>
                  {item.name} <Text style={styles.codeText}>({item.code})</Text>
                </Text>
                <Text style={[styles.rateText, Typography.Pretendard_M_14]}>{item.rate} 원</Text>

                {/* 환율 단위 표시 (예: 1 USD, 100 JPY) 주석처리 */}

                {/* <Text style={[styles.subText, Typography.Pretendard_M_12]}>
                  {item.code === 'JPY' ? '100' : '1'} {item.code}
                </Text> */}
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <Text style={[
                Typography.Pretendard_M_12,
                { color: statusColor }
              ]}>
                {statusSign}{Math.abs(calculatedChange).toFixed(2)}원
              </Text>

              <View style={{ width: 2 }} />

              <Text style={[
                Typography.Pretendard_M_12,
                { color: statusColor }
              ]}>
                ({statusSign}{Math.abs(item.percentChange).toFixed(2)}%)
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
