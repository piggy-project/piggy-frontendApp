import React from 'react';
import BaseHeader from './BaseHeader';
import Notice from './component/Notice';

export default function MyPageHeader() {

  return (
    <BaseHeader
      androidTopInsetScale={0.42}
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
