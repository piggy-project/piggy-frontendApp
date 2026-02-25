import React from 'react';
import { View } from 'react-native';
import MyPageHeader from '../Header/MyPageHeader';
import { styles } from './MyPage.styles';
import MyPageActionButtons from './component/MyPageActionButtons';
import MyPageListMenu from './component/MyPageListMenu';
import ProfileInfo from './component/ProfileInfo';

export default function MyPage() {
  return (
    <View style={styles.container}>
      <MyPageHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ProfileInfo/>
        <MyPageActionButtons />
        <MyPageListMenu />
      </View>
    </View>
  );
}