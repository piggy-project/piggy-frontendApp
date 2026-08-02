import React from 'react';
import BaseHeader from './BaseHeader';
import Notice from './component/Notice';
import Piggylogo from './component/piggylogo';

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
        showCurrencySelector && (
          <Piggylogo />
        )
      }
      center={
        null
      }
      right={
        <>
          <Notice />
        </>
      }
    />
  );
}