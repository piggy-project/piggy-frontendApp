import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './EstimatedMonthRanking.styles';

export default function EstimatedMonthRanking() {
  return (
    <View style={styles.container}>
      <View>
        <Text>
          예상 월별 랭킹
        </Text>
      </View>
    </View>
  );
}