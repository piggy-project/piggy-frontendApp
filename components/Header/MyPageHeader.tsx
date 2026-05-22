import React from 'react';
import BaseHeader from './BaseHeader';
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
