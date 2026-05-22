import React from 'react';
import { Text } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import { styles as baseStyles } from './BaseHeader.styles';

export default function NotificationHeader() {

  return (
    <BaseHeader
      left={
        <>
          <BackButton />
          <Text style={baseStyles.title}>
            알림
          </Text>
        </>
      }
      center={null}
      right={null}
    />
  );
}