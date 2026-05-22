import React from 'react';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';

type Props = {
  onBack: () => void;
};

export default function LoginHeader({ onBack }: Props) {

  return (
    <BaseHeader
      left={
        <BackButton onPress={onBack} />
      }
      center={null}
      right={null}
    />
  );
}