import React from 'react';
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