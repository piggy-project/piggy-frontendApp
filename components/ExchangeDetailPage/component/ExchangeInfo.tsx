import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ExchangeInfo.styles';
import { Typography } from '@/constants/Typography';

interface ExchangeInfoProps {
  currentRate: string;      // 현재 환율 (예: 0.85)
  rateChange?: string;      // 환율 변동 (예: +0.02)
  high: string;             // 오늘의 최고치
  low: string;              // 오늘의 최저치
  inflation: string;        // 인플레이션율
  inflationChange?: string; // 인플레 변동
}

export default function ExchangeInfo({ 
  currentRate, 
  rateChange, 
  high, 
  low, 
  inflation, 
  inflationChange 
}: ExchangeInfoProps) {
    const getChangeColorStyle = (value: string | undefined) => {
    if (!value) return styles.textNeutral; // 값이 없으면 기본색

    if (value.startsWith('+')) {
      return styles.textUp;   // '+'로 시작하면 빨간색
    } else if (value.startsWith('-')) {
      return styles.textDown; // '-'로 시작하면 파란색
    } else {
      return styles.textNeutral; // 그 외(0 등)는 기본색
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, Typography.Pretendard_M_16]}>현재 환율</Text>

      {/* 1. 환율 카드 */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_14]}>환율</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{currentRate}</Text>
          {rateChange && (
            <Text style={[styles.changeText, Typography.Pretendard_M_14, getChangeColorStyle(rateChange)]}>
              {rateChange}
            </Text>
          )}
        </View>
      </View>

      {/* 2. 오늘의 최고치 카드 */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_14]}>오늘의 최고치</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{high}</Text>
        </View>
      </View>

      {/* 3. 오늘의 최저치 카드 */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_14]}>오늘의 최저치</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{low}</Text>
        </View>
      </View>

      {/* 4. 인플레이션율 카드 */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_16]}>인플레이션율</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{inflation}</Text>
          {inflationChange && (
            <Text style={[styles.changeText, Typography.Pretendard_M_14, getChangeColorStyle(inflationChange)]}>
              {inflationChange}
            </Text>
          )}
        </View>
      </View>

    </View>
  );
}