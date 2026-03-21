import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './BaseHeader.styles';

interface Props {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  leftStyle?: StyleProp<ViewStyle>;
  centerStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
}

export default function BaseHeader({ 
  left, 
  center, 
  right, 
  leftStyle, 
  centerStyle, 
  rightStyle 
}: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top }
    ]}>

      {/* 왼쪽: 기본 스타일 + 외부 스타일(있을 경우) */}
      <View style={[styles.leftArea, leftStyle]}>
        {left}
      </View>

      {/* 중앙: 기본 스타일 + 외부 스타일(있을 경우) */}
      <View style={[styles.centerArea, centerStyle]}>
        {center}
      </View>

      {/* 오른쪽: 기본 스타일 + 외부 스타일(있을 경우) */}
      <View style={[styles.rightArea, rightStyle]}>
        {right}
      </View>

    </View>
  );
}