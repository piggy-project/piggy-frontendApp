import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import { Typography } from '@/constants/Typography';



export default function NotificationHeader() {

  return (
    <BaseHeader
      left={
        <View style={styles.leftContainer}>
          <BackButton />
          <Text style={[styles.title, Typography.Pretendard_M_16]}>
            알림
          </Text>
        </View>
      }
      center={null}
      right={null}
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