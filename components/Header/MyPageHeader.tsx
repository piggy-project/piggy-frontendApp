import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';



export default function MyPageHeader() {

  return (
    <BaseHeader
      left={
        <View style={styles.leftContainer}>
          <BackButton />
          <Text style={[styles.title, Typography.Pretendard_M_16]}>
            마이페이지
          </Text>
        </View>
      }
      center={null}
      right={
        <Ionicons name="settings-outline" size={24} color="gray" />
      }
    />
  );
}

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: '#000',
        marginLeft: 8,
    },
});