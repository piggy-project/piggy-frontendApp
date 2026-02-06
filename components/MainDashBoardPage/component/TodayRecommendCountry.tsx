import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './TodayRecommendCountry.style';

export default function TodayRecommendCountry() {
  return (
    <View style={styles.container}>
      <View>
        <Text>
          오늘 추천 국가
        </Text>
      </View>
    </View>
  );
}