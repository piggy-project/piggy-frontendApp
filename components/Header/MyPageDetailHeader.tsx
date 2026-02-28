import React from 'react';
import { StyleSheet } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';

export default function MyPageDetailHeader() {

  return (
    <BaseHeader
      left={
        <BackButton/>
      }
      center={null}
      right={
        null
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