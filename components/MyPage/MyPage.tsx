import React from 'react';
import { View } from 'react-native';
import MyPageHeader from '../Header/MyPageHeader';
import { styles } from './MyPage.styles';
import SavedCountries from './component/SavedCountries';
import MyWishlist from './component/MyWishlist';
import UserActivity from './component/UserActivity'
import ProfileInfo from './component/ProfileInfo';

export default function MyPage() {
  return (
    <View style={styles.container}>
      <MyPageHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ProfileInfo />
        <SavedCountries />
        <MyWishlist />
        <UserActivity />
      </View>
    </View>
  );
}