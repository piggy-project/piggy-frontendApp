import React from 'react';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';



export default function NoneHeader() {

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