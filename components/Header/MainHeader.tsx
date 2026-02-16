import React from 'react';
import { View } from 'react-native';
import BaseHeader from './BaseHeader';
import Notion from './component/Notice';
import Sidebar from './component/Sidebar';
import WonSign from './component/WonSign';

interface Props {
  showCurrencySelector?: boolean;
  showBackButton?: boolean;
}

export default function MainHeader({
  showCurrencySelector = true,
  showBackButton = false,
}: Props) {
  const handleCurrencySelect = (selected: any) => {
    console.log('메인 헤더에서 감지함:', selected);
    // 여기서 전역 상태(Context)를 업데이트하거나 API를 다시 호출할 수 있습니다.
  };

  return (
    <BaseHeader
      left={
        <View style={{ marginLeft: 10 }}> 
          {showCurrencySelector && (
            <WonSign onSelect={handleCurrencySelect} />
          )}
        </View>
      }
      center={
        null
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