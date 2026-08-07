import SearchCommunity from '@/components/CommunityPage/component/SearchCommunity';
import React from 'react';
import BaseHeader from './BaseHeader';
import { styles as baseStyles } from './BaseHeader.styles';
import Notice from './component/Notice';

interface Props {
  onFocus: () => void;
}

export default function CommunityHeader({ onFocus }: Props) {
  return (
    <BaseHeader
      leftStyle={baseStyles.shrinkSideArea}
      left={null}
      centerStyle={baseStyles.wideCenterArea}
      center={
        <SearchCommunity
          variant="header"
          onFocus={onFocus}
        />
      }
      rightStyle={baseStyles.shrinkSideArea}
      right={<Notice />}
    />
  );
}