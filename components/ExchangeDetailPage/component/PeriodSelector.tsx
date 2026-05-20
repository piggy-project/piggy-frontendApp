import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Period = '1D' | '1M' | '3M' | '1Y';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const periodLabels: Record<Period, string> = {
    '1D': '1일',
    '1M': '1개월',
    '3M': '3개월',
    '1Y': '1년'
  };

  return (
    <View style={styles.periodTab}>
      {(['1D', '1M', '3M', '1Y'] as Period[]).map((p) => (
        <TouchableOpacity 
          key={p} 
          onPress={() => onPeriodChange(p)}
          style={[styles.periodButton, selectedPeriod === p && styles.activePeriodButton]}
        >
          <Text style={[styles.periodText, selectedPeriod === p && styles.activePeriodText]}>
            {periodLabels[p]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  periodTab: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 50,
    padding: 2,
    marginTop: 15, // 그래프 아래로 가므로 상단 여백 추가
    width: '100%',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 50,
  },
  activePeriodButton: {
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activePeriodText: {
    color: '#FF3B30',
  },
});
