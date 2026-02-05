import React from 'react';
import { Text, View } from 'react-native';
import MainHeader from '../Parts/MainHeader';
import { styles } from './MainDashBoard.styles';

export default function MainDashBoardPage() {
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <Text>
          메인대시보드
        </Text>
      </View>
    </View>
  );
}