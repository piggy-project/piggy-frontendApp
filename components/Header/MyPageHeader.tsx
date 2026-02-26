import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import Notice from './component/Notice';



export default function MyPageHeader() {

  return (
    <BaseHeader
      left={
        null
      }
      center={null}
      right={
        <Notice/>
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