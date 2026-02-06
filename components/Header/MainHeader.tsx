import React from 'react';
import { Text } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import Notion from './component/Notice';
import Sidebar from './component/Sidebar';

interface Props {
  showCurrencySelector?: boolean;
  showBackButton?: boolean;
}

export default function MainHeader({
  showCurrencySelector = true,
  showBackButton = false,
}: Props) {

  return (
    <BaseHeader
      left={
        showBackButton ? <BackButton /> : null
      }
      center={
        showCurrencySelector ? (
          <Text>
            통화선택 ▼
          </Text>
        ) : null
      }
      right={
        <>
          <Notion />
          <Sidebar />
        </>
      }
    />
  );
}
