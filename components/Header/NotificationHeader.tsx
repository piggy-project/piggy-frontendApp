import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';



export default function NotificationHeader() {

  return (
    <BaseHeader
      left={
        <View style={styles.leftContainer}>
          <BackButton />
          <Text style={styles.title}>
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
        fontSize: 15,
        color: '#000',
        marginLeft: 8,
    },
});