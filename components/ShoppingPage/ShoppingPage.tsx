import React from 'react';
import { Text, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './Shopping.styles';

export default function ShoppingPage() {
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <Text>
          즐겨찾기
        </Text>
      </View>
    </View>
  );
}