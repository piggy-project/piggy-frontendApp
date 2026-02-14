import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './BaseHeader.styles';

interface Props {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export default function BaseHeader({ left, center, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top }
    ]}>

      {/* 왼쪽 */}
      <View style={styles.leftArea}>
        {left}
      </View>

      {/* 중앙 */}
      <View style={styles.centerArea}>
        {center}
      </View>

      {/* 오른쪽 */}
      <View style={styles.rightArea}>
        {right}
      </View>

    </View>
  );
}
