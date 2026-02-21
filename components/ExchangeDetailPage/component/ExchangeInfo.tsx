import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ExchangeInfo.styles';

interface ExchangeInfoProps {
  currentRate?: string;      // 현재 환율 (예: 1,445.63)
  rateChange?: string;      // 환율 변동 (예: +5.21 (0.35%))
  high?: string;            // 오늘의 최고치
  low?: string;             // 오늘의 최저치
  inflation?: string;       // 인플레이션율 (데이터 없을 시 대비)
  inflationChange?: string; // 인플레 변동
}

export default function ExchangeInfo({ 
  currentRate = '0.00', 
  rateChange, 
  high = '0.00', 
  low = '0.00', 
  inflation = '-', 
  inflationChange 
}: ExchangeInfoProps) {
  
  // 상승/하락에 따른 텍스트 색상 결정 함수
  const getChangeColorStyle = (value: string | undefined) => {
    if (!value) return styles.textNeutral;

    if (value.startsWith('+')) {
      return styles.textUp;   // 빨간색
    } else if (value.startsWith('-')) {
      return styles.textDown; // 파란색
    }
    return styles.textNeutral;
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, Typography.Pretendard_M_16]}>실시간 시장 지표</Text>

      {/* 1. 환율 카드 */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_14]}>현재 환율 (KRW)</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{currentRate}</Text>
          {rateChange && (
            <Text style={[styles.changeText, Typography.Pretendard_M_14, getChangeColorStyle(rateChange)]}>
              {rateChange}
            </Text>
          )}
        </View>
      </View>

      {/* 오늘의 최고/최저치는 한 줄에 배치하거나 디자인에 맞춰 유지 */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* 2. 최고치 */}
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>오늘 최고</Text>
          <Text style={[styles.value, Typography.Pretendard_M_16]}>{high}</Text>
        </View>

        {/* 3. 최저치 */}
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>오늘 최저</Text>
          <Text style={[styles.value, Typography.Pretendard_M_16]}>{low}</Text>
        </View>
      </View>

      {/* 4. 인플레이션율 (API 미제공 시를 대비한 처리) */}
      <View style={styles.card}>
        <Text style={[styles.label, Typography.Pretendard_M_14]}>소비자 물가 지수 (예정)</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, Typography.Pretendard_M_20]}>{inflation}%</Text>
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