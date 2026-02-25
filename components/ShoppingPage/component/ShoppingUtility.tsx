import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShoppingUtility.styles';

export default function ShoppingUtility() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={[styles.buttonText, Typography.Pretendard_M_14]}>AR 스캐너</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={[styles.buttonText, Typography.Pretendard_M_14]}>환전 계산기</Text>
      </TouchableOpacity>
    </View>
  );
}