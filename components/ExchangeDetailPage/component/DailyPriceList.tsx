import { Typography } from '@/constants/Typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DailyPrice {
  date: string;
  rate: number;
  change: number;
  percentChange: number;
}

interface DailyPriceListProps {
  data: DailyPrice[];
}

const formatDate = (date: string) => date.replace(/-/g, '.');

export default function DailyPriceList({ data }: DailyPriceListProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, Typography.Pretendard_M_16]}>일일 시세 (최근 10일)</Text>
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 1.5 }]}>날짜</Text>
          <Text style={[styles.headerText, { flex: 2, textAlign: 'center' }]}>환율</Text>
          <Text style={[styles.headerText, { flex: 2.5, textAlign: 'right' }]}>전일대비/등락율</Text>
        </View>
        {data.map((item, index) => {
          const isUp = item.change > 0;
          const isDown = item.change < 0;
          const color = isUp ? '#FF3B30' : isDown ? '#007AFF' : '#8E8E93';
          const sign = isUp ? '▲' : isDown ? '▼' : '';

          return (
            <View key={index} style={[styles.tableRow, index === data.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[styles.dateText, { flex: 1.5 }]}>{formatDate(item.date)}</Text>
              <Text style={[styles.rateText, { flex: 2, textAlign: 'center' }]}>{item.rate.toLocaleString()}원</Text>
              <View style={{ flex: 2.5, alignItems: 'flex-end' }}>
                <Text style={[styles.changeText, { color }]}>
                  {sign} {Math.abs(item.change).toFixed(2)}
                </Text>
                <Text style={[styles.percentText, { color }]}>
                  ({isUp ? '+' : ''}{item.percentChange.toFixed(2)}%)
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20, // 그래프 카드와 동일한 좌우 여백 적용
  },
  headerTitle: {
    marginBottom: 12,
    color: '#1C1C1E',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  dateText: {
    fontSize: 14,
    color: '#3A3A3C',
    fontWeight: '500',
  },
  rateText: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  percentText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
